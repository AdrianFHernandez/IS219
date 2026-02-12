import { ICommand } from '../core/ICommand';
import { ImageService } from '../services/ImageService';

export class ImageGenerateCommand implements ICommand {
  name = 'image-gen';
  description = 'Generate images from a prompt and save to images/ (uses OpenAI image model)';

  constructor(private svc: ImageService) {}

  async execute(args: string[], opts?: any) {
    const prompt = args.join(' ').trim();
    if (!prompt) {
      console.log('Please provide a prompt. Example: image-gen "a red panda reading a book"');
      return;
    }

    const size = opts?.size || '1024x1024';
    const n = Math.min(Number(opts?.count || 1), 10) || 1;

    try {
      console.log(`Generating ${n} image(s) of size ${size} for prompt: ${prompt}`);
      const imgs = await this.svc.generate(prompt, size, n);
      if (!imgs || imgs.length === 0) {
        console.log('No images returned');
        return;
      }

      const files = await this.svc.saveGenerated(prompt, imgs, opts?.outDir || 'images');
      console.log('Saved images:');
      for (const f of files) console.log('  ' + f);
    } catch (err:any) {
      console.error('Image generation failed:', err.message ?? err);
    }
  }
}
