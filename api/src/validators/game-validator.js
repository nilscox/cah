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

const nbQuestions = (value, opts) => {
  if (!value)
    throw new MissingFieldError('nbQuestions');

  if (typeof value !== 'number')
    throw new InvalidFieldTypeError('nbQuestions', 'number');

  if (value < 1 || value > 100)
    throw new ValidationError('nbQuestions', 'this field must be between 1 and 100');

  return value;
};

const cardsPerPlayer = (value, opts) => {
  if (!value)
    throw new MissingFieldError('cardsPerPlayer');

  if (typeof value !== 'number')
    throw new InvalidFieldTypeError('cardsPerPlayer', 'number');

  if (value < 4 || value > 20)
    throw new ValidationError('cardsPerPlayer', 'this field must be between 4 and 20');

  return value;
};

module.exports = validator({
  lang,
  state,
  nbQuestions,
  cardsPerPlayer,
});
