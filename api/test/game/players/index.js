async function beforeEach() {
  this.player = await this.createLoginPlayer();
  this.game = await this.createGame({ owner: this.player });
}

module.exports = {
  beforeEach,
  join: require('./join'),
  leave: require('./leave'),
};
