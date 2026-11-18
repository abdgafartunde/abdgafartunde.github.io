import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
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
    const checkedFeeds = new Set();
    const checkedPdfs = new Set();
    if (new URL(siteUrl).protocol !== 'https:') errors.push('Homepage canonical URL must use HTTPS');
    for (const privatePath of ['_planning', '_tools', 'node_modules', '.git', '.env', 'package.json', 'package-lock.json', 'CV.tex']) {
        try {
            await fs.access(path.join(root, privatePath));
            errors.push(`Private/development file must not be published: ${privatePath}`);
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
    }

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
            for (const feedLink of document.querySelectorAll('link[rel="alternate"][type="application/atom+xml"]')) {
                const feedUrl = new URL(feedLink.href, dom.window.location.href);
                if (feedUrl.origin !== origin) {
                    errors.push(`${prefix}: Atom discovery link must use the site's origin`);
                    continue;
                }
                if (checkedFeeds.has(feedUrl.href)) continue;
                checkedFeeds.add(feedUrl.href);
                let feed;
                try {
                    const feedPath = path.resolve(root, `.${decodeURIComponent(feedUrl.pathname)}`);
                    if (!feedPath.startsWith(root + path.sep)) throw new Error('feed path escapes build directory');
                    feed = new JSDOM(await fs.readFile(feedPath, 'utf8'), { contentType: 'application/xml' });
                    const element = feed.window.document.documentElement;
                    if (element.localName !== 'feed' || element.namespaceURI !== 'http://www.w3.org/2005/Atom') throw new Error('not an Atom feed');
                    const entries = [...element.getElementsByTagNameNS(element.namespaceURI, 'entry')];
                    if ([...pages.values()].some(page => page.window.document.querySelector('.post-article')) && !entries.length) throw new Error('published articles are missing from the feed');
                    for (const entry of entries) {
                        const link = [...entry.getElementsByTagNameNS(element.namespaceURI, 'link')].find(link => !link.getAttribute('rel') || link.getAttribute('rel') === 'alternate');
                        if (!link?.getAttribute('href')) throw new Error('feed entry has no article link');
                        const articleUrl = new URL(link.getAttribute('href'), feedUrl);
                        if (articleUrl.origin !== origin) throw new Error('feed entry does not point to this site');
                        references.push(articleUrl.href);
                    }
                } catch (error) {
                    errors.push(`${prefix}: invalid Atom feed: ${error.message}`);
                } finally {
                    feed?.window.close();
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
                    if (target.toLowerCase().endsWith('.pdf') && !checkedPdfs.has(target)) {
                        checkedPdfs.add(target);
                        const bytes = await fs.readFile(target);
                        if (bytes.subarray(0, 5).toString() !== '%PDF-' || !bytes.subarray(-1024).toString('latin1').trimEnd().endsWith('%%EOF')) throw new Error('invalid or incomplete PDF');
                        const validation = spawnSync('pdfinfo', [target], { encoding: 'utf8' });
                        if (validation.error || validation.status !== 0) throw new Error('PDF validation failed (pdfinfo is required)');
                    }
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

            // Only actual noindex redirects may bypass the content-page audit.
            // A missing main-content ID must fail instead of silently opting out.
            const redirect = [...document.querySelectorAll('meta[http-equiv]')].some(meta => meta.httpEquiv.toLowerCase() === 'refresh') &&
                /\bnoindex\b/i.test(document.querySelector('meta[name="robots"]')?.content || '');
            if (redirect) continue;
            contentPages++;
            if (!document.querySelector('main#main-content')) errors.push(`${prefix}: missing main#main-content landmark`);
            if (document.querySelectorAll('h1').length !== 1) errors.push(`${prefix}: expected exactly one h1`);
            if (!document.querySelector('meta[name="description"]')?.content.trim()) errors.push(`${prefix}: missing page description`);
            const route = '/' + prefix.replace(/(^|\/)index\.html$/, '$1').split('/').map(encodeURIComponent).join('/');
            const expectedUrl = origin + route;
            const canonicals = document.querySelectorAll('link[rel="canonical"]');
            if (canonicals.length !== 1 || canonicals[0].href !== expectedUrl) errors.push(`${prefix}: canonical URL must be ${expectedUrl}`);
            const ogImages = document.querySelectorAll('meta[property="og:image"]');
            const twitterImages = document.querySelectorAll('meta[name="twitter:image"]');
            if (ogImages.length !== 1 || !ogImages[0].content.trim()) errors.push(`${prefix}: missing or duplicate Open Graph image metadata`);
            if (twitterImages.length !== 1 || !twitterImages[0].content.trim()) errors.push(`${prefix}: missing or duplicate X/Twitter image metadata`);
            if (ogImages[0]?.content !== twitterImages[0]?.content) errors.push(`${prefix}: sharing image metadata does not agree`);
            if (!document.querySelector('link[rel="alternate"][type="application/atom+xml"]')) errors.push(`${prefix}: missing Atom feed discovery link`);
            const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
            if (!structuredData.length) errors.push(`${prefix}: missing JSON-LD metadata`);
            for (const data of structuredData) {
                try {
                    const value = JSON.parse(data.textContent);
                    if (value.url && new URL(value.url, origin).href !== expectedUrl) errors.push(`${prefix}: JSON-LD URL does not agree with canonical URL`);
                    if (value['@type'] === 'BlogPosting' && value.image !== ogImages[0]?.content) errors.push(`${prefix}: JSON-LD image does not agree with sharing image`);
                }
                catch { errors.push(`${prefix}: invalid JSON-LD metadata`); }
            }
            for (const current of document.querySelectorAll('nav[aria-label="Primary navigation"] a[aria-current="page"]')) {
                if (current.href !== expectedUrl) errors.push(`${prefix}: aria-current="page" points to a different page`);
            }
            for (const entry of document.querySelectorAll('[data-blog-entry]')) {
                for (const topic of entry.dataset.topics.split(/\s+/).filter(Boolean)) {
                    const button = [...document.querySelectorAll('[data-topic]')].find(button => button.dataset.topic === topic);
                    if (!button || !entry.dataset.search.toLowerCase().includes(button.textContent.trim().toLowerCase())) errors.push(`${prefix}: blog search does not include topic label ${topic}`);
                }
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
