const expect = require('chai').expect;

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
  await game.join(this.player);

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

module.exports = {
  updateGameDontExist,
  updateGameNotPlayer,
  updateGamePlayerNotOwner,
  updateGameLanguage,
};
