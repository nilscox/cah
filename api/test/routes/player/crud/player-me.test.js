const expect = require('chai').expect;

function fetchMeNotPlayer() {
  return this.app
    .get('/api/player/me')
    .expect(401);
}

module.exports = {
  fetchMeNotPlayer,
};