const expect = require('chai').expect;

async function joinGame() {
  const app = this.createSession();
  const player = await this.createLoginPlayer({ nick: 'toto' }, app);

  return app
    .post('/api/game/' + this.game.id + '/join')
    .expect(200)
    .then(res => {
      expect(res.body).to.have.property('players').of.length(2);
    });
}

module.exports = {
  joinGame,
};
