const {
  ValidationErrors,
  ValidationError,
  MissingFieldError,
  ReadOnlyFieldError,
} = require('../../src/errors');

const DEFAULT_OPTS = {
  required: true,
  readOnly: false,
};

module.exports = fields => {

  const keys = Object.keys(fields);

  const validate = async (data, opts = {}) => {
    const partial = !!opts.partial;
    const many = !!opts.many;

    if (many) {
      opts.many = false;

      return await Promise.all(data.map(d => validate(d, opts)));
    }

    const errors = [];
    const validated = {};

    if (!data)
      data = {};

    for (let i = 0; i < keys.length; ++i) {
      const field = keys[i];
      const validator = fields[field].validate || fields[field];
      const fopts = { ...DEFAULT_OPTS, ...(opts[field] || {}) };
      const isset = data[field] !== undefined;

      if (fopts.readOnly)
        fopts.required = false;

      if (partial && !isset)
        continue;

      try {
        if (fopts.required && !isset)
          throw new MissingFieldError(field);

        if (fopts.readOnly && isset)
          throw new ReadOnlyFieldError(field);

        if (isset) {
          const value = await validator(data[field], fopts);

          if (value !== undefined)
            validated[field] = value;
        }
      } catch (e) {
        if (!(e instanceof ValidationError))
          throw e;

        errors.push(e);
      }
    }

    if (errors.length === 1)
      throw errors[0];

    if (errors.length > 0)
      throw new ValidationErrors(errors);

    return validated;
  };

  return {
    validate,
    query: opts => req => validate(req.query, opts),
    body: opts => req => validate(req.body, opts),
  };
};
