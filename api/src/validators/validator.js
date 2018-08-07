const { ValidationErrors, ValidationError } = require('../errors');

module.exports = fields => {

  const keys = Object.keys(fields);

  const validate = async (data, opts = {}) => {
    const partial = !!opts.partial;

    const errors = [];
    const validated = {};

    if (!data)
      data = {};

    for (let i = 0; i < keys.length; ++i) {
      const field = keys[i];
      const validator = fields[field];

      if (partial && !data[field])
        continue;

      try {
        validated[field] = await validator(data[field], opts[field]);
      } catch (e) {
        if (!(e instanceof ValidationError))
          throw e;

        errors.push(e);
      }
    }

    if (errors.length > 0)
      throw new ValidationErrors(errors);

    return validated;
  }

  return {
    validate,
    query: opts => req => validate(req.query, opts),
    body: opts => req => validate(req.body, opts),
  };
};
