const createValidator = require('./createValidator');
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

const validate_nick = nick => {
  if (!nick)
    throw new MissingFieldError('nick');

  if (typeof nick !== 'string')
    throw new InvalidFieldTypeError('nick', 'string');

  if (nick.length < 3)
    throw new ValidationError('nick', 'this field must be at least 3 characters');

  if (nick.length > 64)
    throw new ValidationError('nick', 'this field must be at most 64 characters');

  if (RESERVED_NICKS.indexOf(nick) >= 0)
    throw new ValidationError('nick', 'this nick is unauthorized');

  return nick;
};

const validate_avatar = avatar => {
  if (avatar)
    throw new ReadOnlyField('avatar');

  return avatar;
};

module.exports = createValidator({
  nick: validate_nick,
  avatar: validate_avatar,
});
