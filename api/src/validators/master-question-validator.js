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

const blanks = (value, opts) => {
  if (!(value instanceof Array) || value.filter(v => typeof v === 'number').length !== value.length)
    throw new InvalidFieldTypeError('blanks', 'Array<number>');

  return value;
};

module.exports = validator({
  lang,
  text,
  blanks,
});
