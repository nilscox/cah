const validator = require('./validator');
const {
  ValidationError,
  MissingFieldError,
  ReadOnlyField,
  InvalidFieldTypeError,
} = require('../errors');

const lang = (value, opts = {}) => {
  const readOnly = opts.readOnly || false;

  if (!value)
    throw new MissingFieldError('lang');

  if (readOnly)
    throw new ReadOnlyField('lang');

  if (typeof value !== 'string')
    throw new InvalidFieldTypeError('lang', 'string');

  if (['en', 'fr'].indexOf(value) < 0)
    throw new ValidationError('lang', 'this field must be one of "en", "fr"');

  return value;
};

const state = (value, opts) => {
  if (value)
    throw new ReadOnlyField('state');
};

module.exports = validator({
  lang,
  state,
});
