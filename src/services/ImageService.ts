import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export type GeneratedImage = { b64_json: string };

export class ImageService {
  client: OpenAI;

  constructor(apiKey?: string) {
    this.client = new OpenAI({ apiKey: apiKey || process.env.OPENAI_API_KEY });
  }

  async generate(prompt: string, size = '1024x1024', n = 1): Promise<GeneratedImage[]> {
    // Uses OpenAI image model (recommended `gpt-image-1`)
    const resp = await this.client.images.generate({
      model: 'gpt-image-1',
      prompt,
      size,
      n
    } as any);

    // SDK returns structure with data array containing b64_json
    if (!resp || !(resp as any).data) return [];
    return (resp as any).data as GeneratedImage[];
  }

  async saveGenerated(prompt: string, images: GeneratedImage[], outDir = 'images') {
    await fs.promises.mkdir(outDir, { recursive: true });

    const sanitize = (s: string) => {
      const name = s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      return name.substring(0, 60) || 'image';
    };

    const baseName = sanitize(prompt);
    const timestamp = Date.now();
    const files: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const g = images[i];
      const b64 = g.b64_json;
      const buf = Buffer.from(b64, 'base64');
      const fileName = `${baseName}_${timestamp}_${i + 1}.png`;
      const filePath = path.join(outDir, fileName);
      await fs.promises.writeFile(filePath, buf);
      files.push(filePath);
    }

    return files;
  }
}
