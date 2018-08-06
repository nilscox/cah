const formatter = require('./formatter');
const ChoiceFormatter = require('./choice-formatter');

module.exports = {
  full: formatter({
    nick: player => player.get('nick'),
    avatar: player => player.get('avatar'),
    cards: async player => {
      const cards = await player.getCards();

      if (!cards.length)
        return;

      return await ChoiceFormatter.full(cards, { many: true });
    },
  }),
};
