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

const text = ValueValidator({
  type: 'string',
  required: true,
});

const blanks = ValueValidator({
  type: 'number',
  required: true,
  many: true,
  allowNull: true,
});

module.exports = Validator({
  lang,
  text,
  blanks,
});
