const validator = require('./validator');
const {
  ValidationError,
  InvalidFieldTypeError,
} = require('../errors');

const LANGS = ['fr', 'en'];

const lang = (value, opts) => {
  if (typeof value !== 'string')
    throw new InvalidFieldTypeError('lang', 'string');

  if (LANGS.indexOf(value) < 0)
    throw new ValidationError('lang', 'this field must be one of ["fr", "en"]');

  return value;
};

const text = (value, opts) => {
  if (typeof value !== 'string')
    throw new InvalidFieldTypeError('text', 'string');

  return value;
};

const keepCapitalization = (value, opts) => {
  if (typeof value !== 'boolean')
    throw new InvalidFieldTypeError('keepCapitalization', 'boolean');

  return value;
};

module.exports = validator({
  lang,
  text,
  keepCapitalization,
});
