const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node run_image_gen.js "prompt" [size] [count]');
    process.exit(1);
  }
  const prompt = args[0];
  const size = args[1] || '1024x1024';
  const count = Math.min(Number(args[2] || 1), 10);

  const client = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('Generating', count, 'image(s) for:', prompt);

  try {
    const resp = await client.images.generate({ model: 'gpt-image-1', prompt, size, n: count });
    const data = resp.data || [];
    if (!data.length) {
      console.error('No images returned');
      process.exit(1);
    }

    const outDir = path.join(process.cwd(), 'images');
    await fs.promises.mkdir(outDir, { recursive: true });

    const sanitize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').substring(0,60) || 'image';
    const basename = sanitize(prompt);
    const ts = Date.now();
    const files = [];

    for (let i = 0; i < data.length; i++) {
      const b64 = data[i].b64_json;
      const buf = Buffer.from(b64, 'base64');
      const fileName = `${basename}_${ts}_${i+1}.png`;
      const filePath = path.join(outDir, fileName);
      await fs.promises.writeFile(filePath, buf);
      files.push(filePath);
    }

    console.log('Saved images:');
    files.forEach(f => console.log('  ' + f));
  } catch (err) {
    console.error('Error generating image:', err.message || err);
    process.exit(1);
  }
}

main();
