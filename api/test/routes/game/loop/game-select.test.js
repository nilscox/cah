const expect = require('chai').expect;

function selectGameDontExist() {
  expect.fail();
}

function selectNotPlayer() {
  expect.fail();
}

function selectNotInGame() {
  expect.fail();
}

function selectNotInThisGame() {
  expect.fail();
}

function selectGameNotStarted() {
  expect.fail();
}

function selectGameInvalidState() {
  expect.fail();
}

function selectPlayerNotQuestionMaster() {
  expect.fail();
}

function selectMissingAnswerId() {
  expect.fail();
}

function selectAnswerIdNotNumber() {
  expect.fail();
}

function selectChoiceNotInPropositions() {
  expect.fail();
}

function selectPlayer() {
  expect.fail();
}


module.exports = {
  selectGameDontExist,
  selectNotPlayer,
  selectNotInGame,
  selectNotInThisGame,
  selectGameNotStarted,
  selectGameInvalidState,
  selectPlayerNotQuestionMaster,
  selectMissingAnswerId,
  selectAnswerIdNotNumber,
  selectChoiceNotInPropositions,
  selectPlayer,
};
