const expect = require('chai').expect;

async function beforeEach() {
  this.game = await this.createGame({ owner: this.player });
}

function removeGame() {
  return this.app
    .delete('/api/game/' + this.game.id)
    .expect(204);
}

function removeGameDontExist() {
  return this.app
    .delete('/api/game/6')
    .expect(404);
}

module.exports = {
  beforeEach,
  removeGame,
  removeGameDontExist,
};
