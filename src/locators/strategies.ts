import type { Platform } from '../types/domain.js';

export type PlatformLocator = Readonly<Record<Platform, string>>;
export const androidId = (id: string): string => `id=com.saucelabs.mydemoapp.android:id/${id}`;
export const iosPredicate = (predicate: string): string => `-ios predicate string:${predicate}`;
export const iosText = (text: string): string => iosPredicate(`type == 'XCUIElementTypeStaticText' AND label == ${JSON.stringify(text)}`);
export const iosButton = (title: string): string => iosPredicate(`type == 'XCUIElementTypeButton' AND name == ${JSON.stringify(title)} AND visible == 1`);
export const pair = (android: string, ios: string): PlatformLocator => ({ android, ios });

export class LocatorHelper {
  static resolve(locator: PlatformLocator, platform: Platform): string { return locator[platform]; }
}
