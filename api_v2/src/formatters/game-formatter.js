const formatter = require('./formatter');
const PlayerFormatter = require('./player-formatter');
const QuestionFormatter = require('./question-formatter');
const ChoiceFormatter = require('./choice-formatter');
const AnswerFormatter = require('./answer-formatter');

const id = game => game.get('id');

const lang = game => game.get('lang');

const state = game => game.get('state');

const playState = game => game.getPlayState();

const owner = async game => {
  const owner = await game.getOwner();

  if (!owner)
    return;

  return owner.get('nick');
};

const players = game => {
  return Promise.all(game.getPlayers().map(p => PlayerFormatter.light(p)));
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

  if (await game.getPlayState() === 'players_answer')
    return null;

  return await AnswerFormatter.anonymous(propositions, { many: true });
};

const selectedAnswer = async game => {
  const answer = await game.getSelectedAnswer();

  if (!answer)
    return;

  return await AnswerFormatter.full(answer);
};

module.exports = {
  full: formatter({
    id,
    lang,
    state,
    playState,
    owner,
    players,
    question,
    questionMaster,
    propositions,
    selectedAnswer,
  }),
};
