export interface CommandHandler<Command, Result, Context = unknown> {
  execute(command: Command, context: Context): Result | Promise<Result>;
}
