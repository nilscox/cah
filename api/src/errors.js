class APIError extends Error {

  constructor(status, message) {
    super(message);

    this.status = status;
  }

  toJSON() {
    return { error: this.message };
  }

}

class BadRequestError extends APIError {

  constructor(message) {
    super(400, message);
  }

}

class ValidationError extends BadRequestError {

  constructor(field, message) {
    if (!field)
      throw new Error('missing field in validator');

    if (!message)
      throw new Error('missing message in validator');

    super(message);

    this.field = field;
  }

  toJSON() {
    return { [this.field]: this.message };
  }

}

class ValidationErrors extends BadRequestError {

  constructor(errors) {
    const n = Object.keys(errors).length;

    super(`ValidationErrors: ${n} invalid field${n >= 2 ? 's' : ''}`);
    this.errors = errors;
  }

  toJSON() {
    return this.errors.reduce((obj, err) => ({ ...obj, ...err.toJSON() }), {});
  }

}

class NotFoundError extends APIError {

  constructor(model) {
    super(404, `${model} not found`);
  }

}

class MissingFieldError extends ValidationError {

  constructor(field) {
    super(field, 'this field is required');
  }

}

class InvalidFieldTypeError extends ValidationError {

  constructor(field, type) {
    super(field, `this field must be of type ${type}`)
  }

}

class ReadOnlyFieldError extends ValidationError {

  constructor(field) {
    super(field, 'this field is read only');
  }

}

class AuthenticationError extends APIError {

  constructor(message) {
    super(401, 'unauthorized: ' + message);
  }

}

module.exports = {
  APIError,
  BadRequestError,
  ValidationErrors,
  ValidationError,
  MissingFieldError,
  InvalidFieldTypeError,
  ReadOnlyFieldError,
  NotFoundError,
  AuthenticationError,
};
