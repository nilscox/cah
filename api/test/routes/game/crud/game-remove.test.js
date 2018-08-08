const expect = require('chai').expect;

function removeGameNotPlayer() {

}

function removeGameDontExist() {
  return this.app
    .delete('/api/game/6')
    .expect(404);
}

function removeRunningGame() {

}

function removeGameNotByOwner() {

}

module.exports = {
  removeGameNotPlayer,
  removeGameDontExist,
  removeRunningGame,
  removeGameNotByOwner,
};
