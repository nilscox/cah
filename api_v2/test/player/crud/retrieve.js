const expect = require('chai').expect;

async function retrievePlayer() {
  const player = await this.createPlayer();

  return this.app
    .get('/api/player/' + player.nick)
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('nick', player.nick);
    });
}

function retrievePlayerDontExist() {
  return this.app
    .get('/api/player/nils')
    .expect(404);
}

module.exports = {
  retrievePlayer,
  retrievePlayerDontExist,
};
