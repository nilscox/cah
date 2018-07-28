const Validator = require('./validator');
const {
  ValidationError,
  MissingFieldError,
  ReadOnlyField,
  InvalidFieldTypeError,
} = require('../errors');

class GameValidator extends Validator {

  constructor() {
    super(['lang', 'state']);
  }

  validate_lang(lang, opts) {
    opts = opts || {};

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
  }

  validate_state(state) {
    if (state)
      throw new ReadOnlyField('state');

    return state;
  }
}


module.exports = GameValidator;
