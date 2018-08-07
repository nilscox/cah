const expect = require('chai').expect;

async function beforeEach() {
  this.player = await this.createLoginPlayer();
}

async function updatePlayerNotLogin() {
  const player = await this.createPlayer({ nick: 'toto' });

  return this.createSession()
    .put('/api/player/' + player.nick)
    .expect(401);
}

async function updatePlayerNotMe() {
  const player = await this.createPlayer({ nick: 'toto' });

  return this.app
    .put('/api/player/' + player.nick)
    .expect(401);
}

function updatePlayer() {
  return this.app
    .put('/api/player/' + this.player.nick)
    .expect(200)
    .then(res => {
      expect(res.body).to.deep.eql({
        nick: this.player.nick,
        avatar: this.player.avatar,
      });
    });
}

function updatePlayerNick() {
  return this.app
    .put('/api/player/' + this.player.nick)
    .send({ nick: 'tom' })
    .expect(400)
    .then(res => {
      expect(res.body).to.have.property('nick');
    });
}

module.exports = {
  beforeEach,
  updatePlayerNotLogin,
  updatePlayerNotMe,
  updatePlayer,
  updatePlayerNick,
};
