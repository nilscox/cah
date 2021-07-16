import { validate } from 'class-validator';
import { Request, RequestHandler } from 'express';

import { HttpUnauthorizedError, HttpValidationErrors } from './errors';
import { AsyncErrorRequestHandler, AsyncRequestHandler, InputDto } from './Route';

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
