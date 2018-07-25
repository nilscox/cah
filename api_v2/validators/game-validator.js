const Validator = require('./validator');
const {
  ValidationError,
  MissingFieldError,
  ReadOnlyField,
  InvalidFieldTypeError,
} = require('../errors');

class GameValidator extends Validator {

  constructor(models) {
    super(models, ['lang', 'state']);
  }

  validate_lang(lang) {
    if (!lang)
      throw new MissingFieldError('lang');

    if (typeof lang !== 'string')
      throw new InvalidFieldTypeError('lang', 'string');

    if (['en', 'fr'].indexOf(lang) < 0)
      throw new ValidationError('lang', 'this field must be one of "en", "fr"');

    return lang;
  }

  validate_state(state) {
    if (state)
      throw new ReadOnlyField('state');

    return state;
  }
}


module.exports = GameValidator;
