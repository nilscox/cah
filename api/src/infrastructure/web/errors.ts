import { ValidationError } from 'class-validator';
import { CustomError } from 'ts-custom-error';

export abstract class HttpError extends CustomError {
  constructor(readonly status: number, message: string, readonly meta?: Record<string, unknown>) {
    super(message);
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(message: string, meta?: Record<string, unknown>) {
    super(404, message, meta);
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(message: string, meta?: Record<string, unknown>) {
    super(401, message, meta);
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(message: string, meta?: Record<string, unknown>) {
    super(400, message, meta);
  }
}

export class HttpValidationErrors extends HttpBadRequestError {
  constructor(readonly errors: ValidationError[]) {
    super(`Validation errors`, { errors });
  }
}

export class HttpInternalServerError extends HttpError {
  constructor(message: string, meta: Record<string, unknown>) {
    super(500, message, meta);
  }
}
