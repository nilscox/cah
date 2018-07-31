const expect = require('chai').expect;

async function retrieveGameNotPlayer() {
  const app = this.createSession();
  const game = await this.createGame({ owner: this.player });

  return app
    .get('/api/game/' + game.id)
    .expect(401);
}

function retrieveGameDontExist() {
  return this.app
    .get('/api/game/6')
    .expect(404);
}

async function retrieveGame() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .get('/api/game/' + game.id)
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('id', game.id);
    });
}

module.exports = {
  retrieveGameNotPlayer,
  retrieveGameDontExist,
  retrieveGame,
};
