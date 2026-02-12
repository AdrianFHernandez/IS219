import { ICommand } from '../core/ICommand';
import { OpenAIService } from '../services/OpenAIService';
import { BingProvider } from '../providers/BingProvider';
import { OpenAIProvider } from '../providers/OpenAIProvider';
import { formatResults } from '../utils/formatters';

export class WebSearchCommand implements ICommand {
  name = 'web-search';
  description = 'Search the web using providers (openai|bing)';

  constructor(private openAI: OpenAIService) {}

  async execute(args: string[], opts?: any) {
    const query = args.join(' ').trim();
    if (!query) {
      console.log('Please provide a query. Example: web-search "latest nodejs news"');
      return;
    }

    try {
      console.log(`Searching for: ${query}`);

      const providerName = (opts?.provider || 'openai').toLowerCase();
      let results: any;

      if (providerName === 'bing') {
        const bing = new BingProvider(opts?.bingApiKey || undefined);
        results = await bing.search(query);
      } else {
        const openAIProvider = new OpenAIProvider(this.openAI);
        results = await openAIProvider.search(query);
      }

      const format = opts?.format || (opts?.raw ? 'json' : 'pretty');
      const out = formatResults(results, format);
      console.log(out);
    } catch (err:any) {
      console.error('Search failed:', err.message ?? err);
    }
  }
}
