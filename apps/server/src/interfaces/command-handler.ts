export interface CommandHandler<Command = unknown, Result extends string | void = void> {
  execute(command: Command): Promise<Result>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandlerCommand<Handler> = Handler extends CommandHandler<infer Command, any> ? Command : never;
