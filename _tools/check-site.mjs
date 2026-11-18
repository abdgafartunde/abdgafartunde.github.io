import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import axe from 'axe-core';
import { HtmlValidate } from 'html-validate';
import { JSDOM } from 'jsdom';

// This documentation is published by another repository at the same hostname.
// Everything else at the site's origin must resolve inside the build artifact.
const separateProjects = ['/ertkit/'];
const validator = new HtmlValidate({
    extends: ['html-validate:recommended'],
    rules: {
        // Accept Jekyll/Kramdown's equivalent HTML serialization and long titles.
        'void-style': 'off',
        'attribute-empty-style': 'off',
        'no-trailing-whitespace': 'off',
        'long-title': 'off',
        // The redirect plugin omits optional <head>/<body> tags in valid HTML.
        'no-implicit-close': 'off',
        'svg-focusable': 'off'
    }
});

async function htmlFiles(directory) {
    const files = [];
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await htmlFiles(filename));
        else if (filename.endsWith('.html')) files.push(filename);
    }
    return files.sort();
}

export async function checkSite(directory) {
    const root = path.resolve(directory);
    const errors = [];
    const pages = new Map();
    const files = await htmlFiles(root);
    if (!files.length) throw new Error(`No HTML pages found in ${root}`);

    const home = new JSDOM(await fs.readFile(path.join(root, 'index.html'), 'utf8'));
    const siteUrl = home.window.document.querySelector('link[rel="canonical"]')?.href;
    home.window.close();
    if (!siteUrl) throw new Error('Homepage has no canonical URL');
    const origin = new URL(siteUrl).origin;
    const label = filename => path.relative(root, filename).split(path.sep).join('/');

    try {
        for (const filename of files) {
            const html = await fs.readFile(filename, 'utf8');
            const dom = new JSDOM(html, {
                url: new URL(label(filename), `${origin}/`).href,
                runScripts: 'outside-only',
                pretendToBeVisual: true
            });
            pages.set(filename, dom);
            const report = await validator.validateString(html);
            for (const result of report.results) {
                for (const message of result.messages.filter(item => item.severity === 2)) {
                    errors.push(`${label(filename)}:${message.line}: HTML ${message.ruleId}: ${message.message}`);
                }
            }
        }

        let contentPages = 0;
        for (const [filename, dom] of pages) {
            const document = dom.window.document;
            const prefix = label(filename);
            // Expose this site's menu, theme and search controls for the audit.
            // Only the local enhancement script runs; analytics, fonts and other
            // third-party resources are never requested by this checker.
            if ([...document.scripts].some(script => new URL(script.src || 'about:blank').pathname === '/assets/js/site.js')) {
                dom.window.matchMedia = query => {
                    const media = new dom.window.EventTarget();
                    media.media = query;
                    media.matches = query === '(min-width: 992px)';
                    return media;
                };
                try {
                    dom.window.eval(await fs.readFile(path.join(root, 'assets/js/site.js'), 'utf8'));
                } catch (error) {
                    errors.push(`${prefix}: site script failed: ${error.message}`);
                }
            }
            const ids = new Set();
            for (const element of document.querySelectorAll('[id]')) {
                if (ids.has(element.id)) errors.push(`${prefix}: duplicate ID "${element.id}"`);
                ids.add(element.id);
            }

            const references = [];
            for (const image of document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')) {
                references.push(image.content);
            }
            for (const element of document.querySelectorAll('[href], [src], [poster], [srcset]')) {
                for (const attribute of ['href', 'src', 'poster']) {
                    if (element.hasAttribute(attribute)) references.push(element.getAttribute(attribute));
                }
                // Data-URL srcsets contain commas and have no local file to check.
                const srcset = element.getAttribute('srcset');
                if (srcset && !srcset.includes('data:')) {
                    references.push(...srcset.split(',').map(item => item.trim().split(/\s+/)[0]));
                }
            }
            for (const reference of new Set(references)) {
                try {
                    const url = new URL(reference, dom.window.location.href);
                    if (url.origin !== origin) continue;
                    if (separateProjects.some(mount => url.pathname === mount.slice(0, -1) || url.pathname.startsWith(mount))) continue;
                    let target = path.resolve(root, `.${decodeURIComponent(url.pathname)}`);
                    if (target !== root && !target.startsWith(root + path.sep)) throw new Error('path escapes the build directory');
                    const stat = await fs.stat(target);
                    if (stat.isDirectory()) target = path.join(target, 'index.html');
                    await fs.access(target);
                    if (url.hash && pages.has(target)) {
                        const fragment = decodeURIComponent(url.hash.slice(1).split(':~:text=')[0]);
                        const destination = pages.get(target).window.document;
                        if (fragment && !destination.getElementById(fragment) &&
                            ![...destination.querySelectorAll('a[name]')].some(anchor => anchor.name === fragment)) {
                            throw new Error(`missing fragment "${fragment}"`);
                        }
                    }
                } catch (error) {
                    errors.push(`${prefix}: broken internal reference "${reference}": ${error.code || error.message}`);
                }
            }

            // Redirect pages have no shared content layout; their links are checked above.
            if (!document.getElementById('main-content')) continue;
            contentPages++;
            if (document.querySelectorAll('h1').length !== 1) errors.push(`${prefix}: expected exactly one h1`);
            if (!document.querySelector('meta[name="description"]')?.content.trim()) errors.push(`${prefix}: missing page description`);
            if (!document.querySelector('link[rel="canonical"]')?.href.startsWith(`${origin}/`)) errors.push(`${prefix}: missing or incorrect canonical URL`);
            for (const data of document.querySelectorAll('script[type="application/ld+json"]')) {
                try { JSON.parse(data.textContent); }
                catch { errors.push(`${prefix}: invalid JSON-LD metadata`); }
            }

            dom.window.eval(axe.source);
            const audit = await dom.window.axe.run(document, {
                // JSDOM cannot measure rendered colors or geometry. These still
                // require browser/manual review; this is a structural audit.
                rules: { 'color-contrast': { enabled: false } }
            });
            for (const violation of audit.violations) {
                for (const node of violation.nodes) {
                    errors.push(`${prefix}: accessibility ${violation.id}: ${violation.help} (${node.target.join(', ')})`);
                }
            }
        }
        return { htmlPages: files.length, contentPages, errors };
    } finally {
        for (const dom of pages.values()) dom.window.close();
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    try {
        const result = await checkSite(process.argv[2] || '_site');
        if (result.errors.length) {
            for (const error of result.errors) console.error(`FAIL: ${error}`);
            console.error(`Site checks failed with ${result.errors.length} issue(s).`);
            process.exitCode = 1;
        } else {
            console.log(`PASS: internal links, fragments, assets and HTML across ${result.htmlPages} pages.`);
            console.log(`PASS: structural accessibility and metadata across ${result.contentPages} content pages.`);
            console.log('External websites and separately hosted project docs are not deployment gates. Visual contrast and layout need browser review.');
        }
    } catch (error) {
        console.error(`Site checks could not run: ${error.message}`);
        process.exitCode = 1;
    }
}
