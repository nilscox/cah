const expect = require('chai').expect;

module.exports.retrieve0 = function() {
  return this.app
    .get('/api/game/' + this.game.id + '/history')
    .expect(200)
    .then(res => {
      expect(res.body).to.be.an('array').of.length(0);
    });
}

module.exports.retrieve2 = function() {
  expect.fail();
}
