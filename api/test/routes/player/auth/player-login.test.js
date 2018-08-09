const expect = require('chai').expect;

async function loginPlayerLogin() {
  await this.loginPlayer(this.player);

  return this.app
    .post('/api/player/login')
    .send({ nick: this.player.nick })
    .expect(401);
}

module.exports = {
  loginPlayerLogin,
};
