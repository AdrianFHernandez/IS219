import { parseOpenAIResponse } from '../services/responseParser';

describe('parseOpenAIResponse', () => {
  test('parses JSON inside code block', () => {
    const resp = {
      output: [
        {
          content: [
            {
              type: 'output_text',
              text: '```json\n[{"title":"A","snippet":"S","url":"U"}]\n```'
            }
          ]
        }
      ]
    };

    const parsed = parseOpenAIResponse(resp);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].title).toBe('A');
  });

  test('parses plain output_text JSON', () => {
    const resp = { output_text: '[{"title":"B","snippet":"S2","url":"U2"}]' };
    const parsed = parseOpenAIResponse(resp);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].title).toBe('B');
  });

  test('returns raw when no JSON present', () => {
    const resp = { output_text: 'no json here' };
    const parsed = parseOpenAIResponse(resp);
    expect(parsed).toHaveProperty('raw');
    expect(parsed.raw).toContain('no json here');
  });
});
