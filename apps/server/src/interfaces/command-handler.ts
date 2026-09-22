export interface CommandHandler<
  Command = unknown,
  Result extends string | void = void,
> {
  execute(command: Command): Promise<Result>;
}

export type HandlerCommand<Handler> =
  // oxlint-disable-next-line typescript/no-explicit-any
  Handler extends CommandHandler<infer Command, any> ? Command : never;
