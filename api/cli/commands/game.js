const request = require('../request');
const format = require('../format');
const { CLIError } = require('../error');

const getPlayer = async () => {
  const { body } = await request('/api/player/me', { expect: [200] });
  return body;
};

const getGame = async (id) => {
  if (!id)
    id = (await getPlayer()).gameId;

  if (!id)
    throw new CLIError('player is not in game');

  const { body } = await request('/api/game/' + id, { expect: [200] });
  return body;
};

module.exports.get = {
  desc: 'find a game',
  usage: '[--id=<id>]',
  options: [
    { name: '--id', desc: 'the game\'s id' },
  ],
  handle: async (args) => {
    const { id } = args;

    const { status, body } = await request('/api/game' + (id ? '/' + id : ''), {
      expect: [200],
    });

    if (id === undefined)
      body.forEach(g => console.log(format.game(g)));
    else
      console.log(format.game(body));
  },
};

module.exports.create = {
  desc: 'create a new game',
  usage: '--lang=<lang> --nbQuestions=<nbQuestions> --cardsPerPlayer=<cardsPerPlayer>',
  options: [
    { name: '--lang', desc: 'the game\'s language' },
    { name: '--nbQuestions', desc: 'number of questions' },
    { name: '--cardsPerPlayer', desc: 'cards / player' },
  ],
  handle: async (args) => {
    const { status, body } = await request('/api/game', {
      method: 'POST',
      expect: [201],
      body: args,
    });

    console.log(format.game(body));
  },
};

module.exports.me = {
  desc: 'retrieve my game',
  usage: '',
  options: [],
  handle: async (args) => {
    const game = await getGame();

    console.log(format.game(game));
  },
};

module.exports.join = {
  desc: 'join a game',
  usage: '--id=<id>',
  options: [
    { name: '--id', desc: 'the game\'s id' },
  ],
  handle: async (args) => {
    const { body } = await request('/api/game/' + args.id + '/join', {
      method: 'POST',
      expect: [200],
    });

    console.log(format.game(body));
  },
};

module.exports.leave = {
  desc: 'leave a game',
  usage: '',
  options: null,
  handle: async (args) => {
    const game = await getGame();

    const { body } = await request('/api/game/' + game.id + '/leave', {
      method: 'POST',
      expect: [204],
    });

    console.log('OK');
  },
};

module.exports.start = {
  desc: 'start a game',
  usage: '',
  options: [],
  handle: async (args) => {
    const game = await getGame();

    const { body } = await request('/api/game/' + game.id + '/start', {
      method: 'POST',
      expect: [200],
      body: args,
    });

    console.log(format.game(body));
  },
};

module.exports.answer = {
  desc: 'answer a question',
  usage: 'x y ...',
  options: [
    { name: 'x y ...', desc: 'the cards to answer' },
  ],
  handle: async (args) => {
    const player = await getPlayer();
    const game = await getGame();

    const cards = args.additional
      .map(i => player.cards[~~i - 1])
      .filter(c => !!c);

    const data = {};

    if (cards.length === 1)
      data.id = cards[0].id;

    if (cards.length > 1)
      data.ids = cards.map(c => c.id);

    const { body } = await request('/api/game/' + game.id + '/answer', {
      method: 'POST',
      expect: [200],
      body: data,
    });

    console.log(format.game(body));
  },
};

module.exports.select = {
  desc: 'select an answer',
  usage: 'x',
  options: [
    { name: 'x', desc: 'the answer to select' },
  ],
  handle: async (args) => {
    const game = await getGame();

    const answer = game.propositions[~~args.additional[0] - 1];

    const data = {};

    if (answer)
      data.id = answer.id;

    const { body } = await request('/api/game/' + game.id + '/select', {
      method: 'POST',
      expect: [200],
      body: data,
    });

    console.log(format.game(body));
  },
};

module.exports.next = {
  desc: 'end this turn',
  usage: '',
  options: [],
  handle: async (args) => {
    const game = await getGame();

    const { body } = await request('/api/game/' + game.id + '/next', {
      method: 'POST',
      expect: [200],
    });

    console.log(format.game(body));
  },
};
