const expect = require('chai').expect;

function listGamesNotLoggedIn() {
  return this.createSession()
    .get('/api/game')
    .expect(401);
}

function listGames0() {
  return this.app
    .get('/api/game')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
};

async function listGames1() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .get('/api/game')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(1);
      expect(res.body[0]).to.have.property('id', game.id);
    });
};

module.exports = {
  listGamesNotLoggedIn,
  listGames0,
  listGames1,
};
