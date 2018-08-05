const Formatter = require('./formatter');
const PlayerFormatter = require('./player-formatter');
const QuestionFormatter = require('./question-formatter');

const id = game => game.get('id');

const state = game => game.get('state');

const owner = async game => {
  const owner = await game.getOwner();

  if (!owner)
    return;

  return owner.nick;
};

const players = game => {
  return Promise.map(game.getPlayers(), p => new PlayerFormatter().format(p));
};

const question = async game => {
  const question = await game.getCurrentQuestion();

  if (!question)
    return;

  return await new QuestionFormatter().format(question);
};

class GameFormatter extends Formatter {

  static full(game, opts) {
    return new GameFormatter({ id, owner, state, players, question }).format(game, opts);
  }

};

module.exports = GameFormatter;
