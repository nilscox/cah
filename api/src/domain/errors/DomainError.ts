import { CustomError } from 'ts-custom-error';

export class DomainError extends CustomError {
  constructor(message?: string, readonly meta?: Record<string, unknown>) {
    super(message);
  }
}
