async function beforeEach() {
  this.player = await this.createLoginPlayer();
}

module.exports = {
  beforeEach,
  list: require('./list'),
  retrieve: require('./retrieve'),
  create: require('./create'),
  update: require('./update'),
  remove: require('./remove'),
};
