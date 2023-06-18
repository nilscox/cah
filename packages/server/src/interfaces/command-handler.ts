export interface CommandHandler<Command = unknown> {
  execute(command: Command): Promise<void>;
}

export type HandlerCommand<Handler> = Handler extends CommandHandler<infer Command> ? Command : never;
