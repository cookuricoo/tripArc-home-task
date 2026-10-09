import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const manifest = JSON.parse(await readFile(new URL('../config/apps.json', import.meta.url), 'utf8')) as
  Record<string, { file: string; url: string; sha256: string; version: string }>;
const target = process.argv[2] || 'android';
if (!['android', 'ios', 'all'].includes(target)) throw new Error('Usage: npm run apps:download -- android|ios|all');
await mkdir('apps', { recursive: true });
for (const platform of target === 'all' ? ['android', 'ios'] : [target]) {
  const app = manifest[platform];
  const output = resolve('apps', app.file);
  const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
  const existing = await readFile(output).catch(() => undefined);
  if (existing && digest(existing) === app.sha256) {
    console.log(`${platform} ${app.version}: existing file checksum verified`);
    continue;
  }
  const response = await fetch(app.url, { signal: AbortSignal.timeout(180_000) });
  if (!response.ok) throw new Error(`App download failed: HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (digest(bytes) !== app.sha256) throw new Error(`Checksum mismatch for ${app.file}; refusing to use artifact`);
  try {
    await writeFile(`${output}.part`, bytes);
    await rename(`${output}.part`, output);
  } finally { await rm(`${output}.part`, { force: true }); }
  console.log(`${platform} ${app.version}: downloaded and SHA-256 verified at ${output}`);
}
