const { ValidationErrors, ValidationError } = require('../errors');

const createValidator = validators => (data, opts = {}) => {
  const partial = !!opts.partial;
  const errors = [];
  const validated = {};
  let promise = Promise.resolve();

  if (!data)
    data = {};

  Object.keys(validators).map(field => {
    if (!data[field] && partial)
      return;

    promise = promise
      .then(() => validators[field](data[field]))
      .then(value => validated[field] = value)
      .catch(e => {
        if (!(e instanceof ValidationError))
          throw e;

        errors.push(e)
      });
  });

  return promise
    .then(() => {
      if (errors.length > 0)
        throw new ValidationErrors(errors);

      return validated;
    });
};

module.exports = createValidator;
