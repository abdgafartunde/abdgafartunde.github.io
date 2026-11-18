import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { generateSocialImages, renderCard } from './generate-social-images.mjs';

test('long article titles fit completely in a 1200 × 630 PNG without truncation', () => {
    const title = "Mathematics After Proof Scarcity: What Terence Tao's ICM 2026 Lecture Means for Mathematicians";
    const { png, layout } = renderCard({ title, date: '17 AUG 2026', author: "Abd'gafar Tunde Tiamiyu", hostname: 'example.test' });
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
    assert.equal(layout.lines.join(' '), title);
    assert.ok(layout.lines.length * layout.lineHeight <= 276);
});

test('article-specific titles produce different images', () => {
    const details = { date: '09 NOV 2026', author: 'A.T. Tiamiyu', hostname: 'example.test' };
    const first = renderCard({ ...details, title: 'Applying for the Hong Kong PhD Fellowship' });
    const second = renderCard({ ...details, title: 'Inverse Problems and Scientific Computing' });
    assert.equal(first.png.equals(second.png), false);
});

test('generates only built posts, keeps date-specific paths and respects custom image overrides', async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'article-cards-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const dates = ['2026/11/09', '2026/11/16', '2026/11/23'];
    for (const date of dates) {
        const route = `/blog/${date}/same-title/`;
        const image = date.endsWith('/23') ? '/custom.png' : `/assets/images/social${route}card.png`;
        const destination = path.join(directory, route, 'index.html');
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.writeFile(destination, `<html><head><link rel="canonical" href="https://example.test${route}">
            <meta property="og:image" content="https://example.test${image}"><meta name="author" content="A.T. Tiamiyu"></head>
            <body><article class="post-article"><div class="post-meta-top"><time datetime="2026-11-09T00:00:00+08:00">09 November 2026</time></div>
            <h1 class="post-title">Same title</h1></article></body></html>`);
    }
    await fs.writeFile(path.join(directory, 'index.html'), '<h1>Home</h1>');
    assert.equal(await generateSocialImages(directory), 2);
    for (const date of dates.slice(0, 2)) {
        const image = await fs.readFile(path.join(directory, 'assets/images/social/blog', date, 'same-title/card.png'));
        assert.equal(image.readUInt32BE(16), 1200);
    }
    await assert.rejects(fs.access(path.join(directory, 'assets/images/social/blog/2026/11/23/same-title/card.png')));
});
