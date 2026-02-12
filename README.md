# AI Toolkit CLI

Simple, SOLID-friendly Node.js CLI scaffold in TypeScript.

Setup

1. Copy your API keys into `.env` (e.g. `OPENAI_API_KEY=...`).
2. Install dependencies:

```bash
npm install
```

Run (dev):

```bash
npm run dev -- web-search "your query here"
```

Generate images (example):

```bash
npm run dev -- image-gen "a photorealistic golden retriever puppy wearing a red bandana" --size 1024x1024 --count 2
```

Generated images are saved under the `images/` directory with filenames derived from a sanitized version of the prompt, timestamp, and index.

Notes

- `web-search` currently uses the OpenAI Responses API as a web-search agent when possible. If you need a production web search integration, consider adding Bing or SerpAPI and updating `WebSearchCommand`.
