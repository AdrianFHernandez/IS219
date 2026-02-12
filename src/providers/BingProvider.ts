import { ISearchProvider } from './ISearchProvider';
import axios from 'axios';

export class BingProvider implements ISearchProvider {
  name = 'bing';
  constructor(private apiKey?: string) {
    this.apiKey = apiKey || process.env.BING_API_KEY;
  }

  async search(query: string) {
    if (!this.apiKey) throw new Error('BING_API_KEY not provided');

    const url = `https://api.bing.microsoft.com/v7.0/search`;
    const resp = await axios.get(url, {
      params: { q: query, count: 5 },
      headers: { 'Ocp-Apim-Subscription-Key': this.apiKey }
    });

    // Map common webPages.value to simplified results
    const data = resp.data;
    const results: any[] = [];
    if (data && data.webPages && Array.isArray(data.webPages.value)) {
      for (const item of data.webPages.value.slice(0, 5)) {
        results.push({ title: item.name, snippet: item.snippet, url: item.url });
      }
    }

    return results;
  }
}
