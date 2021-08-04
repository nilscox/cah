import { ErrorRequestHandler } from 'express';
import _ from 'lodash';

import { Logger } from '../../application/interfaces/Logger';
import { DomainError } from '../../domain/errors/DomainError';
import { EntityNotFoundError } from '../../domain/errors/EntityNotFoundError';
import { InvalidChoicesSelectionError } from '../../domain/errors/InvalidChoicesSelectionError';
import { InvalidNumberOfChoicesError } from '../../domain/errors/InvalidNumberOfChoicesError';

import { HttpBadRequestError, HttpError, HttpNotFoundError, HttpValidationErrors } from './errors';

export class DomainErrorMapper {
  execute(error: Error): HttpError {
    if (error instanceof EntityNotFoundError) {
      throw new HttpNotFoundError(error.message, { domainError: error, ...error.meta });
    }

    const badRequestErrors = [InvalidChoicesSelectionError, InvalidNumberOfChoicesError];

    for (const BadRequestError of badRequestErrors) {
      if (error instanceof BadRequestError) {
        throw new HttpBadRequestError(error.message, { domainError: error, ...error.meta });
      }
    }

    throw error;
  }
}

export class ErrorHandler {
  constructor(private readonly logger: Logger) {
    logger.setContext('ErrorHandler');
  }

  private logError(error: HttpError) {
    const { domainError, ...meta } = error.meta ?? {};

    if (error instanceof HttpValidationErrors) {
      this.logger.verbose(error.message);
    } else if (domainError instanceof DomainError) {
      this.logger.verbose(error.message, ...[meta].filter(Boolean));
    } else {
      this.logger.error(error);
    }

    this.logger.debug((domainError as Error)?.stack ?? error.stack ?? '<no stacktrace available>');
  }

  execute: ErrorRequestHandler = (error, req, res) => {
    this.logError(error);

    res.status(error.status ?? 500);

    return {
      error: error.message,
      ..._.omit(error.meta, 'domainError'),
    };
  };
}
