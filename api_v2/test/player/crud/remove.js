async function beforeEach() {
  this.player = await this.createLoginPlayer();
}

async function removePlayerNotLogin() {
  const player = await this.createPlayer({ nick: 'toto' });

  return this.createSession()
    .delete('/api/player/' + player.nick)
    .expect(401);
}

async function removePlayerNotMe() {
  const player = await this.createPlayer({ nick: 'toto' });

  return this.app
    .delete('/api/player/' + player.nick)
    .expect(401);
}

async function removePlayerInGame() {
  const owner = await this.createPlayer({ nick: 'toto' });
  const game = await this.createGame({ owner });
  await game.join(this.player);

  return this.app
    .delete('/api/player/' + this.player.nick)
    .expect(401);
}

function removePlayer() {
  return this.app
    .delete('/api/player/' + this.player.nick)
    .expect(204);
}

module.exports = {
  beforeEach,
  removePlayerNotLogin,
  removePlayerNotMe,
  removePlayerInGame,
  removePlayer,
};
