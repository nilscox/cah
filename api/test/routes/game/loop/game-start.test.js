const expect = require('chai').expect;

function startGameDontExist() {
  expect.fail();
}

function startNotPlayer() {
  expect.fail();
}

function startNotGameOwner() {
  expect.fail();
}

function startGameStarted() {
  expect.fail();
}

function startGameNotEnoughPlayers() {
  expect.fail();
}

function startGame() {
  expect.fail();
}

module.exports = {
  startGameDontExist,
  startNotPlayer,
  startNotGameOwner,
  startGameStarted,
  startGameNotEnoughPlayers,
  startGame,
};