const formatter = require('./formatter');
const choiceFormatter = require('./choice-formatter');

const id = a => a.get('id');

const place = a => a.get('place');

const answeredBy = async a => {
  const player = await a.getPlayer();

  return player.nick;
};

const choices = async a => {
  const choices = await a.getChoices();

  return await choiceFormatter.full(choices, { many: true });
}

module.exports = {
  full: formatter({ id, place, answeredBy, choices }),
  anonymous: formatter({ id, place, choices }),
};
