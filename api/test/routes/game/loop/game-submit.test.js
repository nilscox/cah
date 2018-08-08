const expect = require('chai').expect;

function submitGameDontExist() {
  expect.fail();
}

function submitNotPlayer() {
  expect.fail();
}

function submitNotInGame() {
  expect.fail();
}

function submitNotInThisGame() {
  expect.fail();
}

function submitGameNotStarted() {
  expect.fail();
}

function submitNotGameMaster() {
  expect.fail();
}

function submitGameInvalidState() {
  expect.fail();
}

function submitAlreadySubmitted() {
  expect.fail();
}

function submitMissingChoiceIds() {
  expect.fail();
}

function submitChoiceIdsNotNumber() {
  expect.fail();
}

function submitPlayerDontHaveCards() {
  expect.fail();
}

function submitChoicesNumberDontMatch() {
  expect.fail();
}

function submitGame() {
  expect.fail();
}

module.exports = {
  submitGameDontExist,
  submitNotPlayer,
  submitNotInGame,
  submitNotInThisGame,
  submitGameNotStarted,
  submitNotGameMaster,
  submitGameInvalidState,
  submitAlreadySubmitted,
  submitMissingChoiceIds,
  submitChoiceIdsNotNumber,
  submitPlayerDontHaveCards,
  submitChoicesNumberDontMatch,
  submitGame,
};
