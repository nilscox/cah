const expect = require('chai').expect;

async function loginPlayerLogin() {
  await this.loginPlayer(this.player);

  return this.app
    .post('/api/player/login')
    .send({ nick: this.player.nick })
    .expect(401);
}

function loginPlayer() {
  return this.app
    .post('/api/player/login')
    .send({ nick: this.player.nick })
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('nick', this.player.nick);
    });
}

function loginPlayerDontExist() {
  return this.app
    .get('/api/player/login')
    .send({ nick: 'tom' })
    .expect(404);
}

module.exports = {
  loginPlayerLogin,
  loginPlayer,
  loginPlayerDontExist,
};
