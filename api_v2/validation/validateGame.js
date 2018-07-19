const createValidator = require('./createValidator');
const {
  ValidationError,
  MissingFieldError,
  ReadOnlyField,
  InvalidFieldTypeError,
} = require('../errors');

const validate_lang = lang => {
  if (!lang)
    throw new MissingFieldError('lang');

  if (typeof lang !== 'string')
    throw new InvalidFieldTypeError('lang', 'string');

  if (['en', 'fr'].indexOf(lang) < 0)
    throw new ValidationError('lang', 'this field must be one of "en", "fr"');

  return lang;
};

const validate_state = state => {
  if (state)
    throw new ReadOnlyField('state');

  return state;
};

module.exports = createValidator({
  lang: validate_lang,
  state: validate_state,
});
