const expect = require('chai').expect;

module.exports.retrieveDontExist = function() {
  return this.app
    .get('/api/game/6')
    .expect(404);
}

module.exports.list0 = async function() {
  return this.app
    .get('/api/game')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}

module.exports.list1 = async function() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .get('/api/game')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(1);
      expect(res.body[0]).to.have.property('id', game.id);
    });
}

module.exports.retrieve = async function() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .get('/api/game/' + game.id)
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('id', game.id);
    });
}

module.exports.create = function() {
  return this.app
    .post('/api/game')
    .send({ lang: 'fr', nbQuestions: 2, cardsPerPlayer: 4 })
    .expect(201)
    .then(res => {
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('lang', 'fr');
      expect(res.body).to.have.property('owner', this.player.nick);
      expect(res.body).to.have.property('nbQuestions', 2);
      expect(res.body).to.have.property('cardsPerPlayer', 4);
    });
}

module.exports.update = async function() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .put('/api/game/' + game.id)
    .send({})
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('id', game.id);
    });
}

module.exports.remove = async function() {
  const game = await this.createGame({ owner: this.player });

  return this.app
    .delete('/api/game/' + game.id)
    .expect(204);
}
