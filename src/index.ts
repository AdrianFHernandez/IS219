import './utils/env';
import { Command } from 'commander';
import { CommandRegistry } from './core/CommandRegistry';
import { OpenAIService } from './services/OpenAIService';
import { WebSearchCommand } from './commands/WebSearchCommand';
import { ImageService } from './services/ImageService';
import { ImageGenerateCommand } from './commands/ImageGenerateCommand';

const program = new Command();
const registry = new CommandRegistry();

const openAI = new OpenAIService();

// Register commands (easy to add new ones following the ICommand interface)
registry.register(new WebSearchCommand(openAI));
// image generation command
const imageSvc = new ImageService();
registry.register(new ImageGenerateCommand(imageSvc));

for (const cmd of registry.list()) {
  const sub = program.command(cmd.name + ' [args...]').description(cmd.description);
  // common options: raw, provider, format, bing-api-key
  sub.option('--raw', 'Show raw output from the provider');
  sub.option('--provider <name>', 'Search provider to use (openai|bing)');
  sub.option('--format <fmt>', 'Output format (pretty|json|plain)');
  sub.option('--bing-api-key <key>', 'Bing API key (or set BING_API_KEY in .env)');
  sub.option('--size <size>', 'Image size for image-gen (e.g. 512x512, 1024x1024)');
  sub.option('--count <n>', 'Number of images to generate (image-gen only)');
  sub.action((args: string[], options: any) => {
    cmd.execute(args || [], options || {});
  });
}

program.parse(process.argv);
