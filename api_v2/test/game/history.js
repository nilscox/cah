const expect = require('chai').expect;

async function beforeEach() {
  this.game = await this.createGame();
}

function gameHistory() {

}

function gameHistoryEmpty() {
  return this.app
    .get('/api/game/' + this.game.id + '/history')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}

module.exports = {
  beforeEach,
  gameHistory,
  gameHistoryEmpty,
};
