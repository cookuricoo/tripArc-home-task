import { openAsBlob } from 'node:fs';
import { basename } from 'node:path';
import { required } from '../../config/environment.js';
import { sauceUploadUrl } from '../../config/sauce.js';

const storageId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class CloudUploadHelper {
  static async upload(path: string): Promise<string> {
    const auth = Buffer.from(`${required('SAUCE_USERNAME')}:${required('SAUCE_ACCESS_KEY')}`).toString('base64');
    const name = basename(path);
    const form = new FormData();
    form.append('payload', await openAsBlob(path), name);
    form.append('name', name);
    const response = await fetch(sauceUploadUrl(), {
      method: 'POST', headers: { Authorization: `Basic ${auth}` }, body: form,
      signal: AbortSignal.timeout(180_000),
    });
    if (!response.ok) throw new Error(`Sauce Labs upload failed: HTTP ${response.status}`);
    const result = await response.json() as { item?: { id?: unknown } };
    const id = result.item?.id;
    if (typeof id !== 'string' || !storageId.test(id)) {
      throw new Error('Upload response did not contain a valid storage id');
    }
    return `storage:${id}`;
  }
}
