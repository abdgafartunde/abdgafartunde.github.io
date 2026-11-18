import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { JSDOM } from 'jsdom';

test('Jekyll emits known card dimensions and respects custom image dimensions', async t => {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const source = await fs.mkdtemp(path.join(os.tmpdir(), 'website-metadata-'));
    t.after(() => fs.rm(source, { recursive: true, force: true }));
    await fs.mkdir(path.join(source, '_includes'));
    await fs.mkdir(path.join(source, '_layouts'));
    await fs.copyFile(path.join(root, '_includes/head.html'), path.join(source, '_includes/head.html'));
    await fs.writeFile(path.join(source, '_config.yml'), JSON.stringify({
        url: 'https://example.test', title: 'Test', description: 'Test site',
        plugins: ['jekyll-feed'], author: { name: 'Author' }, social: {}, academic: {}
    }));
    await fs.writeFile(path.join(source, '_layouts/default.html'), '<!doctype html><html lang="en"><head>{% include head.html %}</head><body>{{ content }}</body></html>');
    for (const [name, options] of Object.entries({
        default: '',
        custom: 'image: /custom.jpg\n',
        sized: 'image: /custom.jpg\nimage_width: 800\nimage_height: 800\n'
    })) {
        await fs.writeFile(path.join(source, `${name}.md`), `---\nlayout: default\ntitle: Test\n${options}---\nTest page.`);
    }
    const build = spawnSync('bundle', ['exec', 'jekyll', 'build', '--destination', path.join(source, '_site')], {
        cwd: source, encoding: 'utf8',
        env: { ...process.env, BUNDLE_GEMFILE: path.join(root, 'Gemfile') }
    });
    assert.equal(build.status, 0, build.stdout + build.stderr);
    for (const [name, expected] of Object.entries({ default: ['1200', '630'], custom: [undefined, undefined], sized: ['800', '800'] })) {
        const html = await fs.readFile(path.join(source, '_site', `${name}.html`), 'utf8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        assert.deepEqual(['width', 'height'].map(dimension => document.querySelector(`meta[property="og:image:${dimension}"]`)?.content), expected, `${name}: ${html.slice(0, 1000)}\n${build.stdout}\n${build.stderr}`);
        assert.equal(document.querySelector('meta[property="og:image"]').content, document.querySelector('meta[name="twitter:image"]').content);
        dom.window.close();
    }
});
