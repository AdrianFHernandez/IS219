import fs from 'fs';
import path from 'path';
import { ImageService } from '../services/ImageService';

describe('ImageService (integration-style, mocked)', () => {
  const outDir = path.join('test-output', 'images');

  beforeAll(async () => {
    await fs.promises.mkdir(outDir, { recursive: true });
  });

  afterAll(async () => {
    // clean up created files
    try {
      const files = await fs.promises.readdir(outDir);
      for (const f of files) await fs.promises.unlink(path.join(outDir, f));
    } catch (e) {
      // ignore
    }
  });

  test('generate and saveGenerated writes files when SDK returns base64', async () => {
    const svc = new ImageService('test-key');

    // mock client images.generate to return predictable base64 data
    const sampleB64 = Buffer.from('hello world').toString('base64');
    // Mock the client with a compatible shape (cast to any to avoid SDK typings)
    (svc as any).client = {
      images: {
        generate: jest.fn().mockResolvedValue({ data: [{ b64_json: sampleB64 }] })
      }
    } as any;

    const imgs = await svc.generate('a test prompt', '512x512', 1);
    expect(Array.isArray(imgs)).toBe(true);
    expect(imgs[0].b64_json).toBe(sampleB64);

    const files = await svc.saveGenerated('a test prompt', imgs, outDir);
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) {
      const exists = fs.existsSync(f);
      expect(exists).toBe(true);
    }
  });
});
