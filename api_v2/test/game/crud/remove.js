const expect = require('chai').expect;

async function beforeEach() {
  this.game = await this.createGame({ owner: this.player });
}

function removeGameNotPlayer() {

}

function removeGameDontExist() {
  return this.app
    .delete('/api/game/6')
    .expect(404);
}

function removeRunningGame() {

}

function removeGameNotByOwner() {

}

function removeGame() {
  return this.app
    .delete('/api/game/' + this.game.id)
    .expect(204);
}

module.exports = {
  beforeEach,
  removeGameNotPlayer,
  removeGameDontExist,
  removeRunningGame,
  removeGameNotByOwner,
  removeGame,
};
