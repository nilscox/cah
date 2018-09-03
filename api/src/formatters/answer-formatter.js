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
};

const anonymous = {
  id,
  place,
  choices,
};

const full = {
  ...anonymous,
  answeredBy,
};

const admin = {
  ...full,
  createdAt: formatter.createdAt,
  updatedAt: formatter.updatedAt,
};

module.exports = {
  anonymous: formatter(anonymous),
  full: formatter(full),
  admin: formatter(admin),
};
