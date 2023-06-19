export interface QueryHandler<Query = unknown, Result = unknown> {
  execute(query: Query): Promise<Result>;
}

export type HandlerQuery<Handler> = Handler extends QueryHandler<infer Query> ? Query : never;
