describe('game-model', () => {

  it.skip('should get the propositions', async function() {
    const game = await this.createStartedGame();
    const players = await this.getPlayersWithoutQM(game);
    await this.answerRandomCards(game, players[0]);
  });

});
