const expect = require('chai').expect;

function fetchMeNotPlayer() {
  return this.app
    .get('/api/player')
    .expect(401);
}

function fetchMeCreated() {
  return this.app
    .post('/api/player')
    .send({ nick: 'nils' })
    .then(() => this.app
      .get('/api/player')
      .expect(200)
    )
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: 'nils',
        avatar: null,
      });
    });
}

async function fetchMeLogin() {
  await this.createPlayer();

  return this.app
    .post('/api/player/login')
    .send({ nick: 'nils' })
    .then(() => this.app
      .get('/api/player')
      .expect(200)
    )
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: 'nils',
        avatar: null,
      });
    });
}

module.exports = {
  fetchMeNotPlayer,
  fetchMeCreated,
  fetchMeLogin,
};
