import { ICommandRegistry, ICommand } from './Interfaces';

/**
 * CommandRegistry implementation
 * Single Responsibility: store and retrieve commands
 * Open/Closed: extensible through register method
 * Liskov: substitutable for ICommandRegistry
 */
export class CommandRegistry implements ICommandRegistry {
  private commands: Map<string, ICommand> = new Map();
  private aliases: Map<string, string> = new Map();

  register(command: ICommand): void {
    const key = command.name.toLowerCase();

    // Register main name
    this.commands.set(key, command);

    // Register aliases
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.aliases.set(alias.toLowerCase(), key);
      }
    }
  }

  get(name: string): ICommand | null {
    const key = name.toLowerCase();
    const resolvedKey = this.aliases.get(key) ?? key;
    return this.commands.get(resolvedKey) ?? null;
  }

  list(): ICommand[] {
    return Array.from(this.commands.values());
  }

  resolve(args: string[]): { command: ICommand | null; args: string[] } {
    if (args.length === 0) {
      return { command: null, args: [] };
    }

    const potentialCommand = this.get(args[0]);
    if (potentialCommand) {
      return { command: potentialCommand, args: args.slice(1) };
    }

    return { command: null, args };
  }
}
