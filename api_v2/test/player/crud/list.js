const expect = require('chai').expect;

function listPlayers0() {
  return this.app
    .get('/api/player/list')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}

async function listPlayers2() {
  await this.createPlayer({ nick: 'nils' });
  await this.createPlayer({ nick: 'tom' });

  return this.app
    .get('/api/player/list')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(2);
    });
}

module.exports = {
  listPlayers0,
  listPlayers2,
};
