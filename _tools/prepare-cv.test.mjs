import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const script = fileURLToPath(new URL('./prepare-cv.sh', import.meta.url));

async function fixture(t) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'website-cv-test-'));
    t.after(() => fs.rm(directory, { recursive: true, force: true }));
    const bin = path.join(directory, 'bin');
    await fs.mkdir(bin);
    // Stub external programs to test publication/failure handling independently
    // of the TeX installation, network and PDF parser (used on real site builds).
    const commands = {
        latexmk: `#!/bin/sh
if [ "$TEST_COMPILE" != valid ]; then exit 1; fi
for arg in "$@"; do case "$arg" in -outdir=*) outdir="\${arg#-outdir=}";; esac; done
printf '%%PDF-1.4\\nvalid fixture\\n%%%%EOF\\n' > "$outdir/CV.pdf"
`,
        curl: `#!/bin/sh
for arg in "$@"; do
 if [ "$next" = output ]; then output="$arg"; next=''; fi
 if [ "$arg" = --output ]; then next=output; fi
done
case "$TEST_DOWNLOAD" in
 valid) printf '%%PDF-1.4\\nvalid fixture\\n%%%%EOF\\n' > "$output";;
 partial) printf '%%PDF-1.4\\npartial transfer' > "$output"; exit 18;;
 html) printf '<html>Error</html>' > "$output";;
 corrupt) printf '%%PDF-1.4\\ncorrupt fixture\\n%%%%EOF\\n' > "$output";;
 *) exit 22;;
esac
`,
        pdfinfo: '#!/bin/sh\ngrep -q "valid fixture" "$1"\n'
    };
    for (const [name, text] of Object.entries(commands)) {
        await fs.writeFile(path.join(bin, name), text, { mode: 0o755 });
    }
    await fs.writeFile(path.join(directory, 'CV.pdf'), 'previous valid destination');
    return { directory, bin };
}

for (const scenario of [
    { compile: 'valid', download: 'fail', success: true },
    { compile: 'fail', download: 'valid', success: true },
    { compile: 'fail', download: 'partial', success: false },
    { compile: 'fail', download: 'html', success: false },
    { compile: 'fail', download: 'corrupt', success: false },
    { compile: 'fail', download: 'fail', success: false }
]) {
    test(`CV publication: compile=${scenario.compile}, fallback=${scenario.download}`, async t => {
        const { directory, bin } = await fixture(t);
        const result = spawnSync('bash', [script], {
            cwd: directory, encoding: 'utf8',
            env: { ...process.env, PATH: `${bin}${path.delimiter}${process.env.PATH}`, TEST_COMPILE: scenario.compile, TEST_DOWNLOAD: scenario.download }
        });
        const destination = await fs.readFile(path.join(directory, 'CV.pdf'), 'utf8');
        if (scenario.success) {
            assert.equal(result.status, 0, result.stderr);
            assert.ok(destination.includes('valid fixture'));
            assert.equal((await fs.stat(path.join(directory, 'CV.pdf'))).mode & 0o777, 0o644);
        } else {
            assert.notEqual(result.status, 0);
            assert.equal(destination, 'previous valid destination');
        }
        assert.ok(!(await fs.readdir(directory)).some(name => name.startsWith('.cv-publish.')));
    });
}
