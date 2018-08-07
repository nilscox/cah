const expect = require('chai').expect;

async function beforeEach() {
  const owner = await this.createLoginPlayer();
  this.game = await this.createGame({ owner });
}

function gameHistoryGameDontExist() {
  expect.fail();
}

function gameHistoryNotPlayer() {
  expect.fail();
}

function gameHistoryNotInGame() {
  expect.fail();
}

function gameHistoryNotInThisGame() {
  expect.fail();
}

function gameHistoryGameNotStarted() {
  expect.fail();
}

function gameHistoryEmpty() {
  return this.app
    .get('/api/game/' + this.game.id + '/history')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}

function gameHistory() {
  expect.fail();
}

module.exports = {
  beforeEach,
  gameHistoryGameDontExist,
  gameHistoryNotPlayer,
  gameHistoryNotInGame,
  gameHistoryNotInThisGame,
  gameHistoryGameNotStarted,
  gameHistoryEmpty,
  gameHistory,
};
