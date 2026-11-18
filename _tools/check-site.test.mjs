import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { checkSite } from './check-site.mjs';

function page(body, route = '/') {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
        <title>Website check fixture</title><meta name="description" content="A test page">
        <link rel="canonical" href="https://example.test${route}">
        <meta property="og:image" content="https://example.test/card.svg">
        <meta name="twitter:image" content="https://example.test/card.svg">
        <link rel="alternate" type="application/atom+xml" href="/feed.xml">
        <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebPage', url: 'https://example.test' + route })}</script></head><body>
        <main id="main-content"><h1>Test page</h1>${body}</main></body></html>`;
}

async function fixture(t, files) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'website-check-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const defaults = Object.keys(files).length ? {
        'card.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>',
        'feed.xml': '<feed xmlns="http://www.w3.org/2005/Atom"><title>Test feed</title></feed>'
    } : {};
    for (const [relative, content] of Object.entries({ ...defaults, ...files })) {
        const filename = path.join(directory, relative);
        await fs.mkdir(path.dirname(filename), { recursive: true });
        await fs.writeFile(filename, content);
    }
    return directory;
}

test('accepts working relative links, encoded fragments, assets and separate project docs', async t => {
    const directory = await fixture(t, {
        'index.html': page(`<a href="notes/?q=test#caf%C3%A9">Notes</a>
            <a href="https://example.test/notes/#caf%C3%A9">Absolute link</a>
            <a href="/ertkit/guide/">Separate project</a><a href="https://external.test/">External</a>
            <img src="/images/example.svg" alt="Example diagram">`),
        'notes/index.html': page('<h2 id="café">Notes</h2><a href="../#main-content">Home</a>', '/notes/'),
        'images/example.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>'
    });
    assert.deepEqual((await checkSite(directory)).errors, []);
});

test('rejects broken pages, missing fragments, missing srcset assets and duplicate IDs', async t => {
    const directory = await fixture(t, {
        'index.html': page(`<a href="missing/">Missing page</a><a href="notes/#missing">Missing heading</a>
            <img src="/image.svg" srcset="/image.svg 1x, /missing.svg 2x" alt="Diagram">
            <p id="duplicate">First</p><p id="duplicate">Second</p>`),
        'notes/index.html': page('<p>Notes</p>', '/notes/'),
        'image.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>'
    });
    const { errors } = await checkSite(directory);
    for (const fragment of ['missing/', 'missing fragment', '/missing.svg', 'duplicate ID']) {
        assert.ok(errors.some(error => error.includes(fragment)), `Failed to catch: ${fragment}`);
    }
});

test('rejects unlabelled controls, missing image alternatives and malformed metadata', async t => {
    const directory = await fixture(t, {
        'index.html': page('<button type="button"></button><img src="/image.svg"><script type="application/ld+json">{bad}</script>'),
        'image.svg': '<svg xmlns="http://www.w3.org/2000/svg"/>'
    });
    const { errors } = await checkSite(directory);
    assert.ok(errors.some(error => error.includes('accessibility button-name')));
    assert.ok(errors.some(error => error.includes('accessibility image-alt')));
    assert.ok(errors.some(error => error.includes('invalid JSON-LD')));
});

test('checks redirect targets and refuses an empty build', async t => {
    const directory = await fixture(t, {
        'index.html': page('<p>Home</p>'),
        'old/index.html': '<!DOCTYPE html><html lang="en"><head><title>Redirect</title></head><body><a href="/gone/">Continue</a></body></html>'
    });
    assert.ok((await checkSite(directory)).errors.some(error => error.includes('old/index.html: broken internal reference')));
    const empty = await fixture(t, {});
    await assert.rejects(checkSite(empty), /No HTML pages/);
});

test('returns a failing CLI exit code so deployment can be blocked', async t => {
    const directory = await fixture(t, { 'index.html': page('<a href="/missing/">Missing</a>') });
    const result = spawnSync(process.execPath, [new URL('./check-site.mjs', import.meta.url).pathname, directory], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /broken internal reference/);
});

test('rejects missing social-sharing images referenced by page metadata', async t => {
    const directory = await fixture(t, {
        'index.html': page('<p>Home</p>').replace('</head>', '<meta property="og:image" content="https://example.test/missing-card.png"></head>')
    });
    assert.ok((await checkSite(directory)).errors.some(error => error.includes('missing-card.png')));
});

test('a damaged main landmark cannot bypass accessibility and metadata checks', async t => {
    const directory = await fixture(t, {
        'index.html': page('<button type="button"></button>').replace('id="main-content"', 'id="broken-main"')
    });
    const { errors, contentPages } = await checkSite(directory);
    assert.equal(contentPages, 1);
    assert.ok(errors.some(error => error.includes('missing main#main-content')));
    assert.ok(errors.some(error => error.includes('accessibility button-name')));
});

test('rejects incorrect self-canonicals and missing sharing and structured metadata', async t => {
    const directory = await fixture(t, {
        'index.html': page('<p>Home</p>'),
        'notes/index.html': page('<p>Notes</p>', '/notes/').replace('href="https://example.test/notes/"', 'href="https://example.test/"')
            .replace(/<meta (?:property="og:image"|name="twitter:image")[^>]*>/g, '')
            .replace(/<script type="application\/ld\+json">.*?<\/script>/, '')
    });
    const { errors } = await checkSite(directory);
    for (const detail of ['canonical URL must be', 'Open Graph image metadata', 'X/Twitter image metadata', 'missing JSON-LD']) {
        assert.ok(errors.some(error => error.includes(detail)), detail);
    }
});

test('rejects malformed feeds, dead feed-entry targets and incomplete PDFs', async t => {
    const directory = await fixture(t, { 'index.html': page('<a href="/CV.pdf">CV</a>'), 'feed.xml': 'invalid Atom document', 'CV.pdf': '%PDF-1.7\ntruncated' });
    let result = await checkSite(directory);
    assert.ok(result.errors.some(error => error.includes('invalid Atom feed')));
    assert.ok(result.errors.some(error => error.includes('invalid or incomplete PDF')));
    await fs.writeFile(path.join(directory, 'feed.xml'), '<feed xmlns="http://www.w3.org/2005/Atom"><entry><link href="https://example.test/gone/"/></entry></feed>');
    result = await checkSite(directory);
    assert.ok(result.errors.some(error => error.includes('https://example.test/gone/')));
});

test('rejects accidentally published private planning files', async t => {
    const directory = await fixture(t, { 'index.html': page('<p>Home</p>'), '_planning/draft.md': 'Private draft' });
    assert.ok((await checkSite(directory)).errors.some(error => error.includes('must not be published: _planning')));
});

test('blog search includes the names displayed on the topic filters', async t => {
    const directory = await fixture(t, { 'index.html': page('<button type="button" data-topic="academic-life">Academic life</button><article data-blog-entry data-topics="academic-life" data-search="HKPFS">An essay</article>') });
    assert.ok((await checkSite(directory)).errors.some(error => error.includes('blog search does not include topic label academic-life')));
});

test('accepts URL-encoded canonicals for non-ASCII article paths', async t => {
    const directory = await fixture(t, {
        'index.html': page('<a href="/caf%C3%A9/">Notes</a>'),
        'café/index.html': page('<p>Notes</p>', '/caf%C3%A9/')
    });
    assert.deepEqual((await checkSite(directory)).errors, []);
});

test('rejects first-party blog feeds with off-site article targets', async t => {
    const directory = await fixture(t, {
        'index.html': page('<p>Home</p>'),
        'feed.xml': '<feed xmlns="http://www.w3.org/2005/Atom"><entry><link href="https://other.test/"/></entry></feed>'
    });
    assert.ok((await checkSite(directory)).errors.some(error => error.includes('feed entry does not point to this site')));
});
