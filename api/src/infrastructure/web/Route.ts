import { validate } from 'class-validator';
import { Handler as RequestHandler } from 'express';

import { HttpValidationErrors } from './errors';
import { Handler } from './index';

// eslint-disable-next-line @typescript-eslint/ban-types
export type InputDto = object;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RawBody = any;

export class Route {
  private getDto?: (body: RawBody) => InputDto;
  private handler?: Handler<unknown, unknown>;

  constructor(public readonly method: 'get' | 'post', public readonly endpoint: string) {}

  dto(getDto: (body: RawBody) => InputDto) {
    this.getDto = getDto;
    return this;
  }

  use(handler: Handler<unknown, unknown>) {
    this.handler = handler;
    return this;
  }

  handle: RequestHandler = async (req, res, next) => {
    try {
      if (this.getDto) {
        const errors = await validate(this.getDto(req.body));

        if (errors.length > 0) {
          throw new HttpValidationErrors(errors);
        }
      }

      const result = await this.handler?.execute(req.body);

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
