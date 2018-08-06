const formatter = require('./formatter');
const PlayerFormatter = require('./player-formatter');
const QuestionFormatter = require('./question-formatter');

const id = game => game.get('id');

const state = game => game.get('state');

const owner = async game => {
  const owner = await game.getOwner();

  if (!owner)
    return;

  return owner.get('nick');
};

const players = game => {
  return Promise.all(game.getPlayers().map(p => PlayerFormatter.full(p)));
};

const question = async game => {
  const question = await game.getCurrentQuestion();

  if (!question)
    return;

  return await QuestionFormatter.full(question);
};

const questionMaster = async game => {
  const qm = await game.getQuestionMaster();

  if (!qm)
    return;

  return qm.get('nick');
};

const propositions = async game => {
  const propositions = await game.getPropositions();

  if (!propositions)
    return;

  return propositions;
};

const selectedAnswer = async game => {
  const answer = await game.getSelectedAnswer();

  if (!answer)
    return;

  return answer;
};

module.exports = {
  full: formatter({
    id,
    state,
    owner,
    players,
    question,
    questionMaster,
    propositions,
    selectedAnswer,
  }),
};
