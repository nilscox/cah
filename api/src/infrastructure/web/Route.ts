import { validate } from 'class-validator';
import { Handler as RequestHandler, Request } from 'express';

import { HttpUnauthorizedError, HttpValidationErrors } from './errors';

// eslint-disable-next-line @typescript-eslint/ban-types
export type InputDto = object;

type RouteHandler<T = void> = (req: Request) => T | Promise<T>;

export const middleware = (handler: { execute: (req: Request) => void }): RouteHandler => {
  return (req) => {
    handler.execute(req);
  };
};

export const guard = <T extends void | boolean | string>(
  validate: (req: Request) => T | Promise<T>,
): RouteHandler<void> => {
  return async (req) => {
    const result = await validate(req);

    if (result === false || typeof result === 'string') {
      throw new HttpUnauthorizedError(result || 'unauthorized');
    }
  };
};

export const dto = (dto: (req: Request) => InputDto): RouteHandler => {
  return async (req) => {
    const input = dto(req);
    const errors = await validate(input);

    if (errors.length > 0) {
      throw new HttpValidationErrors(errors);
    }

    req.input = input;
  };
};

export const context = (getContext: (req: Request) => Request['context']): RouteHandler => {
  return (req) => {
    req.context = getContext(req);
  };
};

export const handler = <Result>(handler: {
  execute(input: InputDto, context: Request['context']): Result;
}): RouteHandler<Result> => {
  return (req) => {
    return handler.execute(req.input!, req.context);
  };
};

export class Route {
  private handlers: RouteHandler<unknown>[] = [];

  constructor(public readonly method: 'get' | 'post', public readonly endpoint: string) {}

  use(...handlers: RouteHandler<unknown>[]) {
    this.handlers.push(...handlers);
    return this;
  }

  handle: RequestHandler = async (req, res, next) => {
    try {
      let result: unknown;

      for (const handler of this.handlers) {
        result = await handler(req);
      }

      if (result !== undefined) {
        res.json(result);
      } else {
        res.end();
      }
    } catch (error) {
      next(error);
    }
  };
}
