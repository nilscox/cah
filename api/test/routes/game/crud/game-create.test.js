const expect = require('chai').expect;

function createGameNotPlayer() {
  return this.createSession()
    .post('/api/game')
    .send({ lang: 'fr' })
    .expect(401);
}

async function createGameInGame() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .post('/api/game')
    .send({ lang: 'fr' })
    .expect(401);
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
  createGameNotPlayer,
  createGameInGame,
  createGameMissingLang,
  createGameLangNotNumber,
  createGameInvalidLang,
  createGameWithState,
};
