const expect = require('chai').expect;

async function createPlayerNotLogin() {
  const player = await this.createLoginPlayer()

  return this.app
    .post('/api/player')
    .send({ nick: 'nils' })
    .expect(401);
}

function createPlayer() {
  return this.app
    .post('/api/player')
    .send({ nick: 'nils' })
    .expect(201)
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: 'nils',
        avatar: null,
      });
    });
}

function createPlayerNoNick() {
  return this.app
    .post('/api/player')
    .send({})
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

function createPlayerNickNull() {
  return this.app
    .post('/api/player')
    .send({ nick: null })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

function createPlayerNickNumber() {
  return this.app
    .post('/api/player')
    .send({ nick: 1234 })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

function createPlayerNickInf3() {
  return this.app
    .post('/api/player')
    .send({ nick: '<3' })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

function createPlayerNickSup64() {
  return this.app
    .post('/api/player')
    .send({ nick: '>64'.repeat(22) })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

function createPlayerNickReserved() {
  const RESERVED_NICKS = [
    'list',
    'login',
    'logout',
    'avatar',
  ];

  return Promise.all(RESERVED_NICKS.map(nick => this.app
    .post('/api/player')
    .send({ nick })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    })
  ));
}

async function createPlayerNickExist() {
  const player = await this.createPlayer({ nick: 'nils' });

  return this.app
    .post('/api/player')
    .send({ nick: 'nils' })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

function createPlayerWithAvatar() {
  return this.app
    .post('/api/player')
    .send({ nick: 'nils', avatar: 'avatar' })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('avatar');
    });
}

module.exports = {
  createPlayerNotLogin,
  createPlayer,
  createPlayerNoNick,
  createPlayerNickNull,
  createPlayerNickNumber,
  createPlayerNickInf3,
  createPlayerNickSup64,
  createPlayerNickReserved,
  createPlayerNickExist,
  createPlayerWithAvatar,
};
