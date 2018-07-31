const { AuthenticationError } = require('./errors');

const allow = () => {};

const isPlayer = (req, params, nick) => {
  if (!req.player)
    throw new AuthenticationError('you must a player');

  if (nick && req.player.nick !== nick)
    throw new AuthenticationError('you must be ' + nick);
};

const isNotPlayer = req => {
  if (req.player)
    throw new AuthenticationError('you must not be a player');
};

const isInGame = req => {
  return req.player.getGame()
    .then(game => {
      if (!game)
        throw new AuthenticationError('you must be in game');
    });
};

const isNotInGame = req => {
  return req.player.getGame()
    .then(game => {
      if (game)
        throw new AuthenticationError('you must not be in game');
    });
};

const isGameOwner = req => {
  return req.player.getGame({ include: 'owner' })
    .then(game => {
      if (game.owner.nick !== req.player.nick)
        throw new AuthenticationError('you must be the game owner');
    });
};

module.exports = {

  '/api/player': {

    GET: isPlayer,
    POST: isNotPlayer,

    '/:nick': {
      GET: allow,
      PUT: (req, params) => isPlayer(req, params, params.nick),
      DELETE: [
        (req, params) => isPlayer(req, params, params.nick),
        isNotInGame,
      ],
    },

    '/list': {
      GET: allow,
    },

    '/login': {
      POST: isNotPlayer,
    },

    '/logout': {
      POST: isPlayer,
    },

  },

  '/api/game': {

    GET: [isPlayer],
    POST: [isPlayer, isNotInGame],

    '/:id': {

      GET: [isPlayer],
      PUT: [isPlayer, isInGame, isGameOwner],
      DELETE: [isPlayer, isInGame, isGameOwner],

      '/join': {
        POST: [isPlayer, isNotInGame],
      },

      '/leave': {
        POST: [isPlayer, isInGame],
      },

    },

  },

};
