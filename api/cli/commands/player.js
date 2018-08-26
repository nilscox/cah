const request = require('../request');
const format = require('../format');

const getPlayer = async () => {
  const { body } = await request('/api/player/me', { expect: [200] });
  return body;
};

const getGame = async (id) => {
  const { body } = await request('/api/game/' + id, { expect: [200] });
  return body;
};

module.exports.get = {
  desc: 'find a player',
  usage: '[--nick=<nick>]',
  options: [
    { name: '--nick', desc: 'the player\'s nick' },
  ],
  handle: async (args) => {
    const { nick } = args;

    const { status, body } = await request('/api/player' + (nick ? '/' + nick : ''), {
      expect: [200],
    });

    if (nick === undefined)
      body.forEach(p => console.log(format.player(p)));
    else
      console.log(format.player(body));
  },
};

module.exports.create = {
  desc: 'create a new player',
  usage: '--nick=<nick>',
  options: [
    { name: '--nick', desc: 'the player\'s nick' },
  ],
  handle: async (args) => {
    const { nick } = args;

    const { body } = await request('/api/player', {
      method: 'POST',
      body: { nick },
      expect: [201],
    });

    console.log(format.player(body));
  },
};

module.exports.update = {
  desc: 'update a player',
  usage: '[--avatar=<avatar>]',
  options: [
    { name: '--avatar', desc: 'set the player\'s avatar' },
  ],
  handle: async (args) => {
    const { body } = await request('/api/player', {
      method: 'PUT',
      body: { nick },
      expect: [200],
    });

    console.log(format.player(body));
  },
};

module.exports.login = {
  desc: 'login as a player',
  usage: '--nick=<nick> [--game | -g]',
  options: [
    { name: '--nick', desc: 'the player\'s nick' },
    { name: '--game', alias: ['-g'], desc: 'fetch the player\'s game' },
  ],
  handle: async (args) => {
    const { nick } = args;
    const game = args.game || args.g;

    if (game)
      delete args.game;

    const { body } = await request('/api/player/login', {
      method: 'POST',
      body: { nick },
      expect: [200],
    });

    console.log(format.player(body));

    if (game && body.gameId) {
      const game = await getGame(body.gameId);
      console.log(format.game(game));
    }
  },
};

module.exports.logout = {
  desc: 'logout',
  usage: '',
  handle: async (args) => {
    const { body } = await request('/api/player/logout', {
      method: 'POST',
      expect: [204],
    });

    console.log('OK');
  },
};

module.exports.me = {
  desc: 'retrieve me',
  usage: '[--game | -g]',
  options: [
    { name: '--game', alias: ['-g'], desc: 'include the player\'s game' },
  ],
  handle: async (args) => {
    const player = await getPlayer();

    console.log(format.player(player));

    if ((args.game || args.g) && player.gameId) {
      const game = await getGame(player.gameId);
      console.log(format.game(game));
    }
  },
};
