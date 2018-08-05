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

async function createCards(game, nq, nc) {
  const questions = await masterQuestion.findAll({
    where: { lang: game.lang },
    order: Sequelize.fn('RAND'),
    limit: nq,
  });

  const choices = await masterChoice.findAll({
    where: { lang: game.lang },
    order: Sequelize.fn('RAND'),
    limit: nc,
  });

  await Question.bulkCreate(questions.map(q => ({
    ...q,
    available: true,
    gameId: game.id,
  })));

  await Choice.bulkCreate(choices.map(c => ({
    ...c,
    available: true,
    gameId: game.id,
  })));
}

module.exports = ({ Answer }) => ({

  join: async function join(player) {
    return await this.addPlayer(player);
  },

  leave: async function leave(player) {
    return await this.removePlayer(player);
  },

  dealCards: async function dealCards(player) {
    const choices = await this.getChoices({
      where: { available: true },
      limit: 2 - await player.countCards(),
    });

    await Choice.update({ playerId: player.id }, {
      where: {
        id: { [Op.in]: choices.map(c => c.id) },
      },
    });
  },

  start: async function start({ questions, choices } = {}) {
    await createCards(this, questions, choices);
    await this.setQuestionMaster(this.players[~~(Math.random() * this.players.length)]);
    await Promise.all(this.game.players.map(p => this.dealCards(p)));
    await this.update({ state: 'started' });
  },

  answer: async function answer(player, choices) {
    const answer = new Answer({
      gameId: this.id,
      playerId: player.id,
      questionId: this.question.id,
    });

    await answer.save();
    await Choice.update({ answerId: answer.id }, {
      where: {
        id: { [Op.in]: choices.map(c => c.id) },
      },
    });

    await this.addAnswer(answer);
  },

});
