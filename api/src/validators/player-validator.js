const { Player } = require('../models');
const validator = require('./validator');
const {
  ValidationError,
  BadRequestError,
  InvalidMimeTypeError,
  InvalidFieldTypeError,
} = require('../errors');

const RESERVED_NICKS = [
  'list',
  'login',
  'logout',
  'avatar',
];

const nick = (value, opts) => {
  const unique = opts.unique || true;

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
  if (typeof value !== 'object')
    throw new InvalidFieldTypeError('avatar', 'file');

  const { mimetype, destination, filename, size } = value;

  if (!mimetype || !destination || !filename || !size)
    throw new BadRequestError('avatar', 'invalid file object');

  const mimetypes = ['image/jpeg', 'image/png'];
  if (mimetypes.indexOf(mimetype) < 0)
    throw new InvalidMimeTypeError('avatar', mimetypes);

  const maxSize = 1024 * 1024;
  if (size > maxSize)
    throw new BadRequestError('avatar', 'file size must be lower than ' + maxSize);

  return filename;
}

const extra = value => {
  if (value !== null && typeof value !== 'string')
    throw new InvalidFieldTypeError('extra', 'string');

  return value;
}

module.exports = validator({
  nick,
  avatar,
  extra,
});
