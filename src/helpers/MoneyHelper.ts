export class MoneyHelper {
  static toCents(value: string): number {
    const normalized = value.replace(/\s/g, '');
    const match = /^\$?(\d+)(?:\.(\d{1,2}))?$/.exec(normalized);
    if (!match) throw new Error(`Invalid USD amount: ${value}`);
    return Number(match[1]) * 100 + Number((match[2] ?? '').padEnd(2, '0'));
  }
}
