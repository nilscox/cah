const formatter = require('./formatter');
const playerFormatter = require('./player-formatter');
const questionFormatter = require('./question-formatter');
const choiceFormatter = require('./choice-formatter');
const answerFormatter = require('./answer-formatter');

const id = game => game.get('id');

const lang = game => game.get('lang');

const nbQuestions = game => game.get('nbQuestions');

const cardsPerPlayer = game => game.get('cardsPerPlayer');

const state = game => game.get('state');

const playState = async game => {
  if (game.get('state') !== 'started')
    return;

  return await game.getPlayState();;
}

const owner = async game => {
  const owner = await game.getOwner();

  if (!owner)
    return;

  return owner.get('nick');
};

const players = game => {
  return Promise.all(game.getPlayers().map(p => playerFormatter.light(p)));
};

const playersAdmin = game => {
  return Promise.all(game.getPlayers().map(p => playerFormatter.admin(p)));
};

const currentTurn = async game => await game.countTurns() + 1;

const question = async game => {
  const question = await game.getCurrentQuestion();

  if (!question)
    return;

  return await questionFormatter.full(question);
};

const questionMaster = async game => {
  const qm = await game.getQuestionMaster();

  if (!qm)
    return;

  return qm.get('nick');
};

const fullPropositions = async game => {
  const propositions = await game.getPropositions();

  if (!propositions)
    return;

  return await answerFormatter.full(propositions, { many: true });
};

const propositions = async game => {
  const propositions = await game.getPropositions();

  if (!propositions)
    return;

  const playState = await game.getPlayState();

  if (playState === 'players_answer')
    return null;
  else if (playState === 'question_master_selection')
    return await answerFormatter.anonymous(propositions, { many: true });
  else
    return await answerFormatter.full(propositions, { many: true });
};

const selectedAnswer = async game => {
  const answer = await game.getSelectedAnswer();

  if (!answer)
    return;

  return await answerFormatter.full(answer);
};

const summary = {
  id,
  lang,
  nbQuestions,
  cardsPerPlayer,
  state,
  playState,
  owner,
  currentTurn,
};

const full = {
  ...summary,
  players,
  question,
  questionMaster,
  propositions,
  selectedAnswer,
};

const admin = {
  ...full,
  players: playersAdmin,
  propositions: fullPropositions,
  createdAt: formatter.createdAt,
  updatedAt: formatter.updatedAt,
};

module.exports = {
  summary: formatter(summary),
  full: formatter(full),
  admin: formatter(admin),
};
