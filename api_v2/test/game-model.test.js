describe('game-model', () => {

  it('should get the propositions', async function() {
    const game = await this.createStartedGame();
    const players = await this.getPlayersWithoutQM(game);
    await this.answerRandomCard(game, players[0]);
  });

});
