const NB_QUESTIONS = 10;

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

module.exports = ({
  Sequelize,
  MasterQuestion,
  MasterChoice,
  Question,
  Choice,
  Answer,
  GameTurn,
}) => {

  const Op = Sequelize.Op;

  async function join(player) {
    return await this.addPlayer(player);
  }

  async function leave(player) {
    return await this.removePlayer(player);
  }

  async function dealCards(player) {
    const choices = await this.getChoices({
      where: { available: true },
      limit: this.cardsPerPlayer - await player.countCards(),
    });

    await Choice.update({ playerId: player.id, available: false }, {
      where: {
        id: { [Op.in]: choices.map(c => c.id) },
      },
    });
  }

  async function pickQuestion() {
    const question = (await this.getQuestions({
      where: { available: true },
      limit: 1,
    }))[0];

    if (!question)
      return false;

    await question.update({ available: false });
    await this.setCurrentQuestion(question);

    return true;
  }

  async function start() {
    const playersCount = await this.countPlayers();
    const qm = (await this.getPlayers({
      order: Sequelize.fn('RANDOM'),
      limit: 1,
    }))[0];

    await this.createCards();
    await this.pickQuestion();
    await this.setQuestionMaster(qm);

    for (let i = 0; i < this.players.length; ++i)
      await this.dealCards(this.players[i]);

    await this.update({ state: 'started' });
  }

  async function answer(player, choices) {
    const propositions = await this.getPropositions();
    const answer = new Answer({
      gameId: this.id,
      playerId: player.id,
      questionId: this.questionId,
      place: propositions.length,
    });

    await answer.save();
    await Choice.update({ answerId: answer.id, playerId: null }, {
      where: {
        id: { [Op.in]: choices.map(c => c.id) },
      },
    });

    await this.addAnswer(answer);
  }

  async function select(answer) {
    await this.setSelectedAnswer(answer);
  }

  async function nextTurn() {
    const players = await this.getPlayers();
    const answer = await this.getSelectedAnswer({ include: ['player'] });
    const winner = answer.player;

    const turn = await this.createTurn({
      number: await this.countTurns() + 1,
      questionId: this.questionId,
      questionMasterId: this.questionMasterId,
      winnerId: winner.id,
    });

    await Answer.update({
      gameTurnId: turn.id,
    }, {
      where: { questionId: this.questionId },
    });

    await this.setSelectedAnswer(null);
    if (await this.pickQuestion()) {
      await this.setQuestionMaster(winner);

      for (let i = 0; i < players.length; ++i)
        await this.dealCards(players[i]);
    } else
      await this.end();
  }

  async function end() {
    await this.update({
      state: 'finished',
      playState: null,
      questionMasterId: null,
      selectedAnswerId: null,
      questionId: null,
    });
  }

  return {
    join,
    leave,
    start,
    dealCards,
    pickQuestion,
    answer,
    select,
    nextTurn,
    end,
  };

};
