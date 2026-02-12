export type ResultItem = { title?: string; snippet?: string; url?: string };

export function formatAsJSON(results: any) {
  return JSON.stringify(results, null, 2);
}

export function formatAsPlain(results: ResultItem[]) {
  return results
    .map((r, i) => {
      let out = `${i + 1}. ${r.title ?? 'No title'}`;
      if (r.snippet) out += `\n   ${r.snippet}`;
      if (r.url) out += `\n   ${r.url}`;
      return out;
    })
    .join('\n\n');
}

export function formatResults(results: any, format: string) {
  if (format === 'json') return formatAsJSON(results);
  if (!results) return '';
  if (Array.isArray(results)) {
    if (format === 'plain' || format === 'pretty') return formatAsPlain(results as ResultItem[]);
    return formatAsJSON(results);
  }

  if ((results as any).raw) return formatAsJSON(results);

  return formatAsJSON(results);
}
