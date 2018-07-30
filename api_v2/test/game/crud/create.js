const expect = require('chai').expect;

function createGame() {
  return this.app
    .post('/api/game')
    .send({ lang: 'fr' })
    .expect(201)
    .then(res => {
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('lang', 'fr');
      expect(res.body).to.have.property('owner', this.player.nick);
    });
}

function createGameMissingLang() {
  return this.app
    .post('/api/game')
    .send({})
    .expect(400);
}

function createGameLangNotNumber() {
  return this.app
    .post('/api/game')
    .send({ lang: 1234 })
    .expect(400);
}

function createGameInvalidLang() {
  return this.app
    .post('/api/game')
    .send({ lang: 'ok' })
    .expect(400);
}

function createGameWithState() {
  return this.app
    .post('/api/game')
    .send({ lang: 'fr', state: 'started' })
    .expect(400);
}

module.exports = {
  createGame,
  createGameMissingLang,
  createGameLangNotNumber,
  createGameInvalidLang,
  createGameWithState,
};
