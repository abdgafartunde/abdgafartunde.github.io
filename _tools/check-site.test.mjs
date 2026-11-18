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
        <link rel="canonical" href="https://example.test${route}"></head><body>
        <main id="main-content"><h1>Test page</h1>${body}</main></body></html>`;
}

async function fixture(t, files) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'website-check-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    for (const [relative, content] of Object.entries(files)) {
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
