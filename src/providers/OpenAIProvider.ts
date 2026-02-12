import { ISearchProvider } from './ISearchProvider';
import { OpenAIService } from '../services/OpenAIService';

export class OpenAIProvider implements ISearchProvider {
  name = 'openai';
  constructor(private svc: OpenAIService) {}

  async search(query: string) {
    return this.svc.webSearch(query, false);
  }
}
