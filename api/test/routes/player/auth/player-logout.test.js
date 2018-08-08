const expect = require('chai').expect;

function logoutPlayerNotLogin() {
  return this.createSession()
    .post('/api/player/logout')
    .expect(401);
}

module.exports = {
  logoutPlayerNotLogin,
};
