const expect = require('chai').expect;

function leaveGameDontExist() {
  expect.fail();
}

function leaveNotPlayer() {
  expect.fail();
}

function leaveNotInGame() {
  expect.fail();
}

function leaveNotInThisGame() {
  expect.fail();
}

function leaveGame() {
  expect.fail();
}

module.exports = {
  leaveGameDontExist,
  leaveNotPlayer,
  leaveNotInGame,
  leaveNotInThisGame,
  leaveGame,
};
