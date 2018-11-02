const { Validator, ValueValidator, ValidationError } = require('express-extra');

const LANGS = ['fr', 'en'];

const lang = ValueValidator({
  type: 'string',
  required: true,
  validate: value => {
    if (LANGS.indexOf(value) < 0)
      throw new ValidationError('this field must be one of ["fr", "en"]');
  },
});

const state = ValueValidator({
  type: 'string',
  required: false,
  validate: value => {
    if (value !== undefined)
      throw new ValidationError('this field is read only');
  },
});

const nbQuestions = ValueValidator({
  type: 'number',
  validate: value => {
    if (value < 1 || value > 100)
      throw new ValidationError('nbQuestions', 'this field must be between 1 and 100');
  },
});

const cardsPerPlayer = ValueValidator({
  typq: 'number',
  validate: value => {
    if (value < 4 || value > 20)
      throw new ValidationError('cardsPerPlayer', 'this field must be between 4 and 20');
  },
});

module.exports = Validator({
  lang,
  state,
  nbQuestions,
  cardsPerPlayer,
});
