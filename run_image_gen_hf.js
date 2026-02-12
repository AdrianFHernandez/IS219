const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

async function generateWithHF(prompt) {
  const token = process.env.HUGGINGFACE_API_KEY;
  if (!token) {
    throw new Error('HUGGINGFACE_API_KEY not set in .env');
  }

  const query = { inputs: prompt };
  const url = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3-medium';

  return new Promise((resolve, reject) => {
    const req = https.request(
      new URL(url),
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      },
      (res) => {
        let data = Buffer.alloc(0);
        res.on('data', (chunk) => { data = Buffer.concat([data, chunk]); });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HF API error ${res.statusCode}: ${data.toString()}`));
          }
          resolve(data);
        });
      }
    );

    req.on('error', reject);
    req.write(JSON.stringify(query));
    req.end();
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node run_image_gen_hf.js "prompt" [count]');
    process.exit(1);
  }

  const prompt = args[0];
  const count = Math.min(Number(args[1] || 1), 5);

  console.log('Generating', count, 'image(s) using Hugging Face for:', prompt);

  try {
    const outDir = path.join(process.cwd(), 'images');
    await fs.promises.mkdir(outDir, { recursive: true });

    const sanitize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').substring(0, 60) || 'image';
    const basename = sanitize(prompt);
    const ts = Date.now();
    const files = [];

    for (let i = 0; i < count; i++) {
      const buf = await generateWithHF(prompt);
      const fileName = `${basename}_${ts}_${i + 1}.png`;
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
