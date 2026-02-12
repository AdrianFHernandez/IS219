import { ICommand } from './ICommand';

export class CommandRegistry {
  private commands = new Map<string, ICommand>();

  register(command: ICommand) {
    this.commands.set(command.name, command);
  }

  get(name: string) {
    return this.commands.get(name);
  }

  list() {
    return Array.from(this.commands.values());
  }
}
