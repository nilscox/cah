const validator = require('./validator');
const {
  ValidationError,
  MissingFieldError,
  ReadOnlyField,
  InvalidFieldTypeError,
} = require('../errors');

const lang = (value, opts = {}) => {
  const readOnly = opts.readOnly || false;

  if (!lang)
    throw new MissingFieldError('lang');

  if (readOnly)
    throw new ReadOnlyField('lang');

  if (typeof lang !== 'string')
    throw new InvalidFieldTypeError('lang', 'string');

  if (['en', 'fr'].indexOf(lang) < 0)
    throw new ValidationError('lang', 'this field must be one of "en", "fr"');

  return lang;
};

const state = (value, opts) => {
  if (state)
    throw new ReadOnlyField('state');

  return state;
};

module.exports = validator({
  lang,
  state,
});
