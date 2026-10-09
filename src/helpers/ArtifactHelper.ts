import { browser } from '@wdio/globals';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface ArtifactDriver {
  sessionId?: string;
  isAndroid?: boolean;
  saveScreenshot(path: string): Promise<unknown>;
  getPageSource(): Promise<string>;
  getLogs(type: string): Promise<unknown>;
}
export class ArtifactHelper {
  static async capture(name: string, driver: ArtifactDriver = browser,
    root = join(process.env.ARTIFACTS_DIR || 'artifacts', 'failures')): Promise<string> {
    const safeName = name.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 90);
    const directory = join(root, `${safeName}-${process.pid}-${Date.now()}`);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'session.json'), JSON.stringify({
      sessionId: driver.sessionId, platform: driver.isAndroid ? 'android' : 'ios',
      scenario: name, capturedAt: new Date().toISOString(),
    }, null, 2));
    const results = await Promise.allSettled([
      driver.saveScreenshot(join(directory, 'screenshot.png')),
      driver.getPageSource().then(source => writeFile(join(directory, 'source.xml'), source)),
      driver.getLogs(driver.isAndroid ? 'logcat' : 'syslog').then(logs => writeFile(join(directory, 'device-logs.json'), JSON.stringify(logs, null, 2))),
    ]);
    await writeFile(join(directory, 'capture.json'), JSON.stringify(results.map((r, i) => ({
      artifact: ['screenshot', 'source', 'deviceLogs'][i], status: r.status,
      ...(r.status === 'rejected' ? { reason: String(r.reason) } : {}),
    })), null, 2));
    return directory;
  }
}
