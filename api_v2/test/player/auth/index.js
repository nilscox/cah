async function beforeEach() {
  this.player = await this.createPlayer();
}

module.exports = {
  beforeEach,
  login: require('./login'),
  logout: require('./logout'),
};
