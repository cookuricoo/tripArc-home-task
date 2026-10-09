import { products } from '../data/fixtures.js';
import { DeviceHelper } from './DeviceHelper.js';
export class FixtureHelper {
  static product() { return products[DeviceHelper.platform]; }
}
