import 'dotenv/config';
import { readFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { CloudUploadHelper } from '../src/helpers/CloudUploadHelper.js';

const platform = process.argv[2];
if (platform !== 'android' && platform !== 'ios') throw new Error('Usage: npm run cloud:upload -- android|ios [path]');
const manifest = JSON.parse(await readFile(new URL('../config/apps.json', import.meta.url), 'utf8'));
const app = resolve(process.argv[3] || `apps/${manifest[platform].file}`);
const appId = await CloudUploadHelper.upload(app);
const variable = `SAUCE_${platform.toUpperCase()}_APP`;
console.log(`${variable}=${appId}`);
if (process.env.GITHUB_ENV) await appendFile(process.env.GITHUB_ENV, `${variable}=${appId}\n`);
