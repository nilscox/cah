const formatter = require('./formatter');
const ChoiceFormatter = require('./choice-formatter');

const nick = player => player.get('nick');

const avatar = player => player.get('avatar');

const cards = async player => {
  const game = await player.getGame();

  if (!game || game.state !== 'started')
    return;

  const cards = await player.getCards();

  return await ChoiceFormatter.full(cards, { many: true });
};

module.exports = {
  full: formatter({ nick, avatar, cards }),
  light: formatter({ nick, avatar }),
};
