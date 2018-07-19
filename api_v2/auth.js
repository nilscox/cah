const { AuthenticationError } = require('./errors');

const isPlayer = (req, res, next) => {
  if (!req.player)
    return next(new AuthenticationError());

  next();
};

module.exports = {
  isPlayer,
};
