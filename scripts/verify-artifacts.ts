import { spawnSync } from 'node:child_process';
import { readdir, readFile, stat, mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const started = Date.now();
const diagnosticRoot = resolve('artifacts/diagnostics');
const failureRoot = join(diagnosticRoot, 'failures');
const temporarySpec = resolve(`tests/diagnostics/.failure-${process.pid}.spec.ts`);
await mkdir(resolve('tests/diagnostics'), { recursive: true });
await writeFile(temporarySpec, `import { expect } from '@wdio/globals';
describe('Failure artifact diagnostic', () => {
  it('intentionally fails after the app has launched successfully', () => {
    expect('intentional artifact verification').toBe('expected deliberate failure');
  });
});\n`);
try {
  const result = spawnSync('npm', ['run', 'test:android', '--', '--spec', temporarySpec], {
    stdio: 'inherit', env: { ...process.env, ARTIFACTS_DIR: diagnosticRoot },
  });
  if (result.status === 0) throw new Error('Deliberate failure unexpectedly passed');
} finally { await rm(temporarySpec, { force: true }); }
const directories = await readdir(failureRoot).catch(() => []);
const fresh = directories.filter(name => Number(name.split('-').at(-1)) >= started);
let complete = false;
for (const name of fresh) {
  const records = JSON.parse(await readFile(join(failureRoot, name, 'capture.json'), 'utf8')) as { artifact: string; status: string }[];
  if (['screenshot', 'source'].every(name => records.some(r => r.artifact === name && r.status === 'fulfilled'))) {
    const screenshot = await stat(join(failureRoot, name, 'screenshot.png'));
    const source = await stat(join(failureRoot, name, 'source.xml'));
    if (screenshot.size > 0 && source.size > 0) complete = true;
  }
}
if (!complete) throw new Error('Failure occurred but no new screenshot and source were captured');
console.log('Intentional test failure and screenshot/source capture verified.');
