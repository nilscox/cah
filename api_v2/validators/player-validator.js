const { Player } = require('../models');
const Validator = require('./validator');
const {
  ValidationError,
  MissingFieldError,
  ReadOnlyField,
  InvalidFieldTypeError,
} = require('../errors');

const RESERVED_NICKS = [
  'list',
  'login',
  'logout',
  'avatar',
];

class PlayerValidator extends Validator {

  constructor() {
    super(['nick', 'avatar']);
  }

  validate_nick(nick, opts) {
    opts = opts || {};

    const unique = opts.unique || true;
    const readOnly = opts.readOnly || false;

    if (!nick)
      throw new MissingFieldError('nick');

    if (readOnly)
      throw new ReadOnlyField('nick');

    if (typeof nick !== 'string')
      throw new InvalidFieldTypeError('nick', 'string');

    if (nick.length < 3)
      throw new ValidationError('nick', 'this field must be at least 3 characters');

    if (nick.length > 64)
      throw new ValidationError('nick', 'this field must be at most 64 characters');

    if (RESERVED_NICKS.indexOf(nick) >= 0)
      throw new ValidationError('nick', 'this nick is unauthorized');

    if (!unique)
      return nick;

    return Player.count({ where: { nick } })
      .then(count => {
        if (count > 0)
          throw new ValidationError('nick', 'this nick is already taken');

        return nick;
      });
  }

  validate_avatar(avatar) {
    if (avatar)
      throw new ReadOnlyField('avatar');

    return avatar;
  }
}


module.exports = PlayerValidator;
