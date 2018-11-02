const { Validator, ValueValidator, ValidationError, InvalidFieldTypeError } = require('express-extra');
const { Player } = require('../models');

const RESERVED_NICKS = [
  'list',
  'login',
  'logout',
  'avatar',
];

const nick = ValueValidator({
  type: 'string',
  required: true,
  validate: async (value, opts) => {
    const unique = opts.unique || true;

    if (value.length < 3)
      throw new ValidationError('this field must be at least 3 characters');

    if (value.length > 64)
      throw new ValidationError('this field must be at most 64 characters');

    if (RESERVED_NICKS.indexOf(value) >= 0)
      throw new ValidationError('this nick is reserved');

    if (opts.unique) {
      const count = await Player.count({ where: { nick: value } });

      if (count > 0)
        throw new ValidationError('this nick is already taken');
    }
  },
});

const avatar = ValueValidator({
  validate: value => {
    if (typeof value !== 'object')
      throw new InvalidFieldTypeError('file');

    const { mimetype, destination, filename, size } = value;

    if (!mimetype || !destination || !filename || !size)
      throw new ValidationError('invalid file object');

    if (['image/jpeg', 'image/png'].indexOf(mimetype) < 0)
      throw new ValidationError('invalid mimetype');

    const maxSize = 1024 * 1024;
    if (size > maxSize)
      throw new ValidationError('file size must be lower than ' + maxSize + ' bytes');
  },
});

const extra = ValueValidator({
  type: 'string',
  required: true,
  allowNull: true,
  defaultValue: null,
});

module.exports = Validator({
  nick,
  avatar,
  extra,
});
