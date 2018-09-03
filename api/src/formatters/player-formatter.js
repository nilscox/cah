const formatter = require('./formatter');
const choiceFormatter = require('./choice-formatter');
const answerFormatter = require('./answer-formatter');


const id = player => player.get('id');
const nick = player => player.get('nick');
const avatar = player => player.get('avatar');
const extra = player => player.get('extra');

const gameId = player => player.get('gameId');

const cards = async player => {
  const cards = await player.getCards();

  if (cards.length === 0)
    return;

  return await choiceFormatter.full(cards, { many: true });
};

const connected = player => !!player.socket;

const submitted = async player => {
  const game = await player.getGame();
  const answer = (await game.getPropositions({ playerId: player.id }))[0];

  if (!answer)
    return;

  return await answerFormatter.full(answer);
}

const light = {
  nick,
  avatar,
  extra,
  connected,
};

const full = {
  ...light,
  gameId,
  cards,
  submitted,
};

const admin = {
  ...full,
  id,
  createdAt: formatter.createdAt,
  updatedAt: formatter.updatedAt,
};

module.exports = {
  light: formatter(light),
  full: formatter(full),
  admin: formatter(admin),
};
