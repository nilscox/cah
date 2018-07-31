const { ValidationErrors, ValidationError } = require('../errors');

class Validator {

  constructor(fields) {
    this.fields = fields;

    this.fields.forEach(field => {
      if (typeof this[`validate_${field}`] !== 'function')
        throw new Error(`Validator: missing validation method for field ${field}`);
    });
  }

  validate(values, opts) {
    opts = opts || {};

    const partial = !!opts.partial;

    const errors = [];
    const validated = {};
    let promise = Promise.resolve();

    if (!values)
      values = {};

    this.fields.forEach(field => {
      if (!values[field] && partial)
        return;

      promise = promise
        .then(() => this[`validate_${field}`](values[field], opts[field]))
        .then(value => validated[field] = value)
        .catch(e => {
          if (!(e instanceof ValidationError))
            throw e;

          errors.push(e);
        });
    });

    return promise
      .then(() => {
        if (errors.length > 0)
          throw new ValidationErrors(errors);

        return validated;
      });
  }
};

module.exports = Validator;
