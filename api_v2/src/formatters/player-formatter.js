const formatter = require('./formatter');
const ChoiceFormatter = require('./choice-formatter');

module.exports = {
  full: formatter({
    nick: player => player.get('nick'),
    avatar: player => player.get('avatar'),
    cards: async player => {
      const game = await player.getGame();

      if (game.state !== 'started')
        return;

      const cards = await player.getCards();

      return await ChoiceFormatter.full(cards, { many: true });
    },
  }),
};
