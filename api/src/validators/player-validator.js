const { Player } = require('../models');
const validator = require('./validator');
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

const nick = (value, opts = {}) => {
  const unique = opts.unique || true;
  const readOnly = opts.readOnly || false;

  if (!value)
    throw new MissingFieldError('nick');

  if (readOnly)
    throw new ReadOnlyField('nick');

  if (typeof value !== 'string')
    throw new InvalidFieldTypeError('nick', 'string');

  if (value.length < 3)
    throw new ValidationError('nick', 'this field must be at least 3 characters');

  if (value.length > 64)
    throw new ValidationError('nick', 'this field must be at most 64 characters');

  if (RESERVED_NICKS.indexOf(value) >= 0)
    throw new ValidationError('nick', 'this nick is unauthorized');

  if (!unique)
    return value;

  return Player.count({ where: { nick: value } })
    .then(count => {
      if (count > 0)
        throw new ValidationError('nick', 'this nick is already taken');

      return value;
    });
}

const avatar = value => {
  if (value)
    throw new ReadOnlyField('avatar');

  return value;
}

module.exports = validator({
  nick,
  avatar,
});
