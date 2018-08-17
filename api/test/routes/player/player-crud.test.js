const expect = require('chai').expect;

module.exports.retrieveDontExist = function() {
  return this.app
    .get('/api/player/nils')
    .expect(404);
}

module.exports.list0 = function() {
  return this.app
    .get('/api/player')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}


module.exports.list2 = async function() {
  await this.createPlayer({ nick: 'nils' });
  await this.createPlayer({ nick: 'tom' });

  return this.app
    .get('/api/player')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(2);
    });
}

module.exports.retrieve = async function() {
  const player = await this.createPlayer();

  return this.app
    .get('/api/player/' + player.nick)
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('nick', player.nick);
    });
}

module.exports.create = function() {
  return this.app
    .post('/api/player')
    .send({ nick: 'nils' })
    .expect(201)
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: 'nils',
        avatar: null,
        connected: false,
      });
    });
}


module.exports.update = async function() {
  const player = await this.createLoginPlayer();

  return this.app
    .put('/api/player/' + player.nick)
    .send({})
    .expect(200)
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: player.nick,
        avatar: player.avatar,
        connected: false,
      });
    });
}

module.exports.remove = async function() {
  const player = await this.createLoginPlayer();

  return this.app
    .delete('/api/player/' + player.nick)
    .expect(204);
}

module.exports.fetchMeCreated = function() {
  return this.app
    .post('/api/player')
    .send({ nick: 'nils' })
    .then(() => this.app
      .get('/api/player/me')
      .expect(200)
    )
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: 'nils',
        avatar: null,
        connected: false,
      });
    });
}

module.exports.fetchMeLogin = async function() {
  await this.createPlayer();

  return this.app
    .post('/api/player/login')
    .send({ nick: 'nils' })
    .then(() => this.app
      .get('/api/player/me')
      .expect(200)
    )
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: 'nils',
        avatar: null,
        connected: false,
      });
    });
}
