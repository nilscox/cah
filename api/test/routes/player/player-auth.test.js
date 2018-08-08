const expect = require('chai').expect;

module.exports.loginDontExist = function() {
  return this.app
    .get('/api/player/login')
    .send({ nick: 'tom' })
    .expect(404);
}

module.exports.login = async function() {
  const player = await this.createPlayer();

  return this.app
    .post('/api/player/login')
    .send({ nick: player.nick })
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('nick', player.nick);
    });
}

module.exports.logout = async function() {
  await this.createLoginPlayer();

  return this.app
    .post('/api/player/logout')
    .expect(204);
}

module.exports.logoutFetchMe = function() {
  return this.app
    .post('/api/player/logout')
    .then(() => this.app
      .get('/api/player/me')
      .expect(401)
    );
}
