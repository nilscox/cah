const validator = require('./validator');
const {
  ValidationError,
  InvalidFieldTypeError,
} = require('../errors');

const lang = value => {
  if (typeof value !== 'string')
    throw new InvalidFieldTypeError('lang', 'string');

  if (['en', 'fr'].indexOf(value) < 0)
    throw new ValidationError('lang', 'this field must be one of "en", "fr"');

  return value;
};

const state = value => value;

const ownerId = value => {
  if (typeof value !== 'number')
    throw new InvalidFieldTypeError('ownerId', 'number');

  return value;
};

const nbQuestions = (value, opts) => {
  if (typeof value !== 'number')
    throw new InvalidFieldTypeError('nbQuestions', 'number');

  if (value < 1 || value > 100)
    throw new ValidationError('nbQuestions', 'this field must be between 1 and 100');

  return value;
};

const cardsPerPlayer = (value, opts) => {
  if (typeof value !== 'number')
    throw new InvalidFieldTypeError('cardsPerPlayer', 'number');

  if (value < 4 || value > 20)
    throw new ValidationError('cardsPerPlayer', 'this field must be between 4 and 20');

  return value;
};

module.exports = validator({
  lang,
  state,
  ownerId,
  nbQuestions,
  cardsPerPlayer,
});
