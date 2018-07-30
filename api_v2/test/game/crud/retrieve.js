const expect = require('chai').expect;

async function retrieveGame() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .get('/api/game/' + game.id)
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('id', game.id);
    });
}

function retrieveGameDontExist() {
  return this.app
    .get('/api/game/6')
    .expect(404);
}

module.exports = {
  retrieveGame,
  retrieveGameDontExist,
};
