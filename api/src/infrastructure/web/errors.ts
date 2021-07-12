import { ValidationError } from 'class-validator';
import { CustomError } from 'ts-custom-error';

export abstract class HttpError extends CustomError {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(message: string) {
    super(400, message);
  }
}

export class HttpValidationErrors extends HttpBadRequestError {
  constructor(public readonly errors: ValidationError[]) {
    super('Validation errors');
  }
}
