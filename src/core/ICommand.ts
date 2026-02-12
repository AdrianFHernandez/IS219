export interface ICommand {
  name: string;
  description: string;
  execute(args: string[], opts?: any): Promise<void>;
}
