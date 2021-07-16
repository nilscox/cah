import { ErrorRequestHandler, Express, Handler as RequestHandler } from 'express';

// eslint-disable-next-line @typescript-eslint/ban-types
export type InputDto = object;

export type AsyncRequestHandler<T = void> = (...args: Parameters<RequestHandler>) => T | Promise<T>;
export type AsyncErrorRequestHandler<T = void> = (...args: Parameters<ErrorRequestHandler>) => T | Promise<T>;

type AsyncHandler = AsyncRequestHandler | AsyncErrorRequestHandler;

abstract class AbstractRoute {
  abstract register(app: Express): void;

  protected middlewares: AsyncHandler[] = [];

  use(...handlers: AsyncRequestHandler[]): AbstractRoute;
  use(...handlers: AsyncErrorRequestHandler[]): AbstractRoute;

  use(...handlers: AsyncHandler[]) {
    this.middlewares.push(...handlers);
    return this;
  }
}

export class Route extends AbstractRoute {
  constructor(public readonly method: 'get' | 'post', public readonly endpoint: string) {
    super();
  }

  register(app: Express): void {
    app[this.method](this.endpoint, ...this.middlewares);
  }
}

export class FallbackRoute extends AbstractRoute {
  register(app: Express): void {
    app.use(...this.middlewares);
  }
}
