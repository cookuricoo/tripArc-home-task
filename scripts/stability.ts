import { spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const count = Number(process.argv[2] || 3);
if (!Number.isInteger(count) || count < 1 || count > 10) throw new Error('Run count must be 1–10');
const results: { run: number; passed: boolean; startedAt: string; durationMs: number }[] = [];
await mkdir('artifacts', { recursive: true });
for (let run = 1; run <= count; run++) {
  const started = Date.now();
  const result = spawnSync('npm', ['run', 'test:android'], { stdio: 'inherit', env: process.env });
  results.push({ run, passed: result.status === 0, startedAt: new Date(started).toISOString(), durationMs: Date.now() - started });
  await writeFile('artifacts/stability.json', JSON.stringify(results, null, 2));
  if (result.status !== 0) { process.exitCode = 1; break; }
}
