const formatter = require('./formatter');
const questionFormatter = require('./question-formatter');
const answerFormatter = require('./answer-formatter');

const number = gt => gt.get('number');

const questionMaster = async gt => {
  return (await gt.getQuestionMaster()).get('nick');
};

const winner = async gt => {
  return (await gt.getWinner()).get('nick');
};

const question = async gt => {
  return questionFormatter.full(await gt.getQuestion());
};

const answers = async gt => {
  return answerFormatter.full(await gt.getAnswers(), { many: true });
};

module.exports = {
  full: formatter({
    number,
    questionMaster,
    winner,
    question,
    answers,
  }),
};
