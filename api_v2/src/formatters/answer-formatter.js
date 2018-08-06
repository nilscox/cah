const formatter = require('./formatter');
const ChoiceFormatter = require('./choice-formatter');

const id = a => a.get('id');

const answeredBy = async a => {
  const player = await a.getPlayer();

  return player.nick;
};

const choices = async a => {
  const choices = await a.getChoices();

  return await ChoiceFormatter.full(choices, { many: true });
}

module.exports = {
  full: formatter({ id, answeredBy, choices }),
  anonymous: formatter({ id, choices }),
};
