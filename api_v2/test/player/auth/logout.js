const expect = require('chai').expect;

async function beforeEach() {
  await this.loginPlayer(this.player);
}

function logoutPlayerNotLogin() {
  return this.createSession()
    .post('/api/player/logout')
    .expect(401);
}

function logoutPlayer() {
  return this.app
    .post('/api/player/logout')
    .expect(204);
}

function logoutPlayerLogout() {
  return this.app
    .post('/api/player/logout')
    .then(() => this.app
      .get('/api/player/me')
      .expect(401)
    );
}

module.exports = {
  beforeEach,
  logoutPlayerNotLogin,
  logoutPlayer,
  logoutPlayerLogout,
};
