import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { JSDOM } from 'jsdom';

test('Markdown preserves both inline math formats, display math and literal dollars', () => {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const convert = `
        config = YAML.load_file('_config.yml').fetch('kramdown')
        puts Kramdown::Document.new(STDIN.read, config).to_html
    `;
    const result = spawnSync('bundle', ['exec', 'ruby', '-rkramdown', '-ryaml', '-r./_plugins/inline_math', '-e', convert], {
        cwd: root,
        encoding: 'utf8',
        input: [
            String.raw`New math $\left\{x_i : x_i \leq 1\right\}$ and legacy math $$x_i$$.`,
            '',
            '$$',
            'x_i^2',
            '$$',
            '',
            'Prices are $10 and $20. Use `$x_i$` in code.',
            '',
            '```text',
            '$x_i$',
            '```'
        ].join('\n')
    });
    assert.equal(result.status, 0, result.stderr);
    const dom = new JSDOM(result.stdout);
    const { document } = dom.window;
    assert.equal(document.querySelector('p').textContent, String.raw`New math \(\left\{x_i : x_i \leq 1\right\}\) and legacy math \(x_i\).`);
    assert.ok(document.body.textContent.includes(String.raw`\[x_i^2\]`));
    assert.deepEqual([...document.querySelectorAll('p')].map(p => p.textContent).slice(1), ['Prices are $10 and $20. Use $x_i$ in code.']);
    assert.equal(document.querySelector('p code').textContent, '$x_i$');
    assert.equal(document.querySelector('pre code').textContent.trim(), '$x_i$');
    dom.window.close();
});
