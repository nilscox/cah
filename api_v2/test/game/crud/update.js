const expect = require('chai').expect;

async function beforeEach() {
  this.game = await this.createGame({ owner: this.player });
  this.url = '/api/game/' + this.game.id;
}

function updateGameDontExist() {
  return this.app
    .put('/api/game/6')
    .send({})
    .expect(404);
}

async function updateGameNotPlayer() {
  const game = await this.createGame({ owner: this.player });

  return this.createSession()
    .put('/api/game/' + game.id)
    .send({})
    .expect(401);
}

async function updateGamePlayerNotOwner() {
  const app = this.createSession();
  const owner = await this.createPlayer({ nick: 'toto' });
  const game = await this.createGame({ owner });
  await this.loginPlayer(this.player, app);
  await this.joinGame(game, this.player);

  return app
    .put('/api/game/' + this.game.id)
    .send({})
    .expect(401);
}

function updateGameLanguage() {
  return this.app
    .put(this.url)
    .send({ lang: 'en' })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('lang');
    });
}

function updateGame() {
  return this.app
    .put(this.url)
    .send({})
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('id', this.game.id);
    });
}

module.exports = {
  beforeEach,
  updateGameDontExist,
  updateGameNotPlayer,
  updateGamePlayerNotOwner,
  updateGameLanguage,
  updateGame,
};
