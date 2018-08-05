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
}) => {

  const Op = Sequelize.Op;

  async function createCards(game, nq, nc) {
    const getEntity = async (Model, limit) => {
      let instances = await Model.findAll({
        where: { lang: game.lang },
        order: Sequelize.fn('RANDOM'),
        limit,
      });

      return instances.map(i => {
        const values = i.get();

        values.available = true;
        values.gameId = game.id;

        return values;
      });
    };

    await Question.bulkCreate(await getEntity(MasterQuestion, nq));
    await Choice.bulkCreate(await getEntity(MasterChoice, nc));
  }

  async function join(player) {
    return await this.addPlayer(player);
  }

  async function leave(player) {
    return await this.removePlayer(player);
  }

  async function dealCards(player) {
    const choices = await this.getChoices({
      where: { available: true },
      limit: 2 - await player.countCards(),
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

    await question.update({ available: false });
    await this.setCurrentQuestion(question);
  }

  async function start({ questions, choices } = {}) {
    const qm = (await this.getPlayers({
      order: Sequelize.fn('RANDOM'),
      limit: 1,
    }))[0];

    await createCards(this, questions, choices);
    await this.pickQuestion();
    await this.setQuestionMaster(qm);

    for (let i = 0; i < this.players.length; ++i)
      await this.dealCards(this.players[i]);

    await this.update({ state: 'started' });
  }

  async function answer(player, choices) {
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
  }

  return {
    join,
    leave,
    start,
    dealCards,
    pickQuestion,
    answer,
  };

};
