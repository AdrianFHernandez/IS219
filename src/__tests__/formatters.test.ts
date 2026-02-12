import { formatResults } from '../utils/formatters';

describe('formatters', () => {
  test('json format returns JSON string', () => {
    const res = [{ title: 'A', snippet: 'S', url: 'U' }];
    const out = formatResults(res, 'json');
    expect(typeof out).toBe('string');
    const parsed = JSON.parse(out);
    expect(Array.isArray(parsed)).toBe(true);
  });

  test('pretty format returns numbered plain output', () => {
    const res = [{ title: 'A', snippet: 'S', url: 'U' }];
    const out = formatResults(res, 'pretty');
    expect(out).toContain('1. A');
    expect(out).toContain('S');
    expect(out).toContain('U');
  });
});
