const expect = require('chai').expect;

function nextGameDontExist() {
  expect.fail()
}

function nextNotPlayer() {
  expect.fail()
}

function nextNotInGame() {
  expect.fail()
}

function nextNotInThisGame() {
  expect.fail()
}

function nextGameNotStarted() {
  expect.fail()
}

function nextGameInvalidState() {
  expect.fail()
}

function nextPlayerNotQuestionMaster() {
  expect.fail()
}

function next() {
  expect.fail()
}


module.exports = {
  nextGameDontExist,
  nextNotPlayer,
  nextNotInGame,
  nextNotInThisGame,
  nextGameNotStarted,
  nextGameInvalidState,
  nextPlayerNotQuestionMaster,
  next,
};
