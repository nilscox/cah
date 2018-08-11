const formatter = require('./formatter');
const choiceFormatter = require('./choice-formatter');

const id = player => player.get('id');
const nick = player => player.get('nick');
const avatar = player => player.get('avatar');

const cards = async player => {
  const game = await player.getGame();

  if (!game || game.state !== 'started')
    return;

  const cards = await player.getCards();

  return await choiceFormatter.full(cards, { many: true });
};

const connected = player => !!player.socket;

const light = {
  nick,
  avatar,
  connected,
};

const full = {
  ...light,
  cards,
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
