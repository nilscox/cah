const expect = require('chai').expect;

async function beforeEach() {
  this.game = await this.createGame({ owner: this.player });
  this.url = '/api/game/' + this.game.id;
}

function updateGame() {
  return this.app
    .put(this.url)
    .send({})
    .expect(200)
    .on('error', e => console.log(e.response.body))
    .then(res => {
      expect(res.body).to.have.property('id', this.game.id);
    });
}

function updateGameDontExist() {
  return this.app
    .put('/api/game/6')
    .send({})
    .expect(404);
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
  beforeEach,
  updateGame,
  updateGameDontExist,
  updateGameLanguage,
};
