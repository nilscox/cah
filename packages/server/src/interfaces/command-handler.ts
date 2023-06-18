export interface CommandHandler<Command> {
  execute(command: Command): Promise<void>;
}
