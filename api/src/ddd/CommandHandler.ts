export interface CommandHandler<Command, Result, Context> {
  execute(command: Command, context: Context): Result | Promise<Result>;
}
