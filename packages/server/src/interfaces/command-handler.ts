export interface CommandHandler<Command> {
  execute(command: Command): Promise<void>;
}

export type HandlerCommand<Handler> = Handler extends CommandHandler<infer Command> ? Command : never;
