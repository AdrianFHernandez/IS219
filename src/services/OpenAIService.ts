import OpenAI from 'openai';
import { parseOpenAIResponse } from './responseParser';

export class OpenAIService {
  client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
  }

  async webSearch(query: string, raw = false) {
    const prompt = `You are a web search assistant. Search the web for: "${query}" and return a JSON array of top 5 results with {title, snippet, url}. Respond only with the JSON array.`;

    const resp = await this.client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt
    });
    if (raw) return resp;
    return parseOpenAIResponse(resp);
  }
}
