export interface QueryHandler<Query, Result, Context = unknown> {
  execute(query: Query, context: Context): Result | Promise<Result>;
}
