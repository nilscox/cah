const expect = require('chai').expect;

module.exports.retrieve0 = async function() {
  const game = await this.createStartedGame({ owner: this.player });

  return this.app
    .get('/api/game/' + game.id + '/history')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}

module.exports.retrieve2 = async function() {
  const game = await this.createRunningGame({ owner: this.player }, undefined, 2);

  return this.app
    .get('/api/game/' + game.id + '/history')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(2);
    });
}
