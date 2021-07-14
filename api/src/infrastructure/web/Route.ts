import { validate } from 'class-validator';
import { ErrorRequestHandler, Express, Handler as RequestHandler, Request } from 'express';

import { HttpUnauthorizedError, HttpValidationErrors } from './errors';

// eslint-disable-next-line @typescript-eslint/ban-types
export type InputDto = object;

type AsyncRequestHandler<T = void> = (...args: Parameters<RequestHandler>) => T | Promise<T>;
type AsyncErrorRequestHandler<T = void> = (...args: Parameters<ErrorRequestHandler>) => T | Promise<T>;

const tryCatch = <T>(handler: AsyncRequestHandler<T>): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const middleware = (handler: { execute: (req: Request) => void | Promise<void> }): AsyncRequestHandler => {
  return tryCatch((req) => handler.execute(req));
};

export const guard = <T extends void | boolean | string>(
  validate: (req: Request) => T | Promise<T>,
): AsyncRequestHandler => {
  return tryCatch(async (req) => {
    const result = await validate(req);

    if (result === false || typeof result === 'string') {
      throw new HttpUnauthorizedError(result || 'unauthorized');
    }
  });
};

export const dto = (dto: (req: Request) => InputDto): AsyncRequestHandler => {
  return tryCatch(async (req) => {
    const input = dto(req);
    const errors = await validate(input);

    if (errors.length > 0) {
      throw new HttpValidationErrors(errors);
    }

    req.input = input;
  });
};

export const context = <T extends Request['context']>(
  getContext: (req: Request) => T | Promise<T>,
): AsyncRequestHandler => {
  return tryCatch(async (req) => {
    req.context = await getContext(req);
  });
};

export const status = (status: number): RequestHandler => {
  return (req, res, next) => {
    res.status(status);
    next();
  };
};

export const handler = <Result>(handler: {
  execute(input: InputDto, context: Request['context']): Result | Promise<Result>;
}): AsyncRequestHandler => {
  return async (req, res, next) => {
    try {
      const result = await handler.execute(req.input!, req.context);

      if (result) {
        res.json(result);
      } else {
        res.end();
      }
    } catch (error) {
      next(error);
    }
  };
};

export const errorHandler = <Result>(handler: {
  execute: AsyncErrorRequestHandler<Result>;
}): AsyncErrorRequestHandler => {
  return async (err, req, res, next) => {
    try {
      const error = await handler.execute(err, req, res, next);

      if (error) {
        res.json(error);
      }
    } catch (error) {
      next(error);
    }
  };
};

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
