const express = require('express');
const path = require('path');
const { spawn } = require('child_process');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(process.cwd(), 'images')));

app.post('/generate', (req, res) => {
  const { prompt, size = '1024x1024', count = '1' } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  const args = [path.join(__dirname, 'run_image_gen.js'), prompt, size, count];
  const proc = spawn(process.execPath, args, { cwd: process.cwd() });

  let stdout = '';
  let stderr = '';

  proc.stdout.on('data', (d) => { stdout += d.toString(); });
  proc.stderr.on('data', (d) => { stderr += d.toString(); });

  proc.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'generator failed', code, stdout, stderr });
    }

    // Parse saved file paths from stdout
    const files = [];
    const lines = stdout.split(/\r?\n/);
    let seenSaved = false;
    for (const line of lines) {
      const l = line.trim();
      if (!seenSaved && l === 'Saved images:') { seenSaved = true; continue; }
      if (seenSaved && l) {
        // line is likely an absolute path or relative
        const base = path.basename(l);
        files.push('/images/' + base);
      }
    }

    return res.json({ files, stdout, stderr });
  });
});

app.listen(PORT, () => {
  console.log(`Web UI running at http://localhost:${PORT}`);
});
