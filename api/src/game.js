const { Sequelize, Choice, Answer } = require('./models');
const events = require('./events');
const Op = Sequelize.Op;

function shuffle(a) {
  let j, x, i;

  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }

  return a;
}

async function join(game, player) {
  await game.addPlayer(player);
  events.emit('game:join', game, player);
}

async function leave(game, player) {
  await player.removeCards(await player.getCards());
  await game.removePlayer(player);
  events.emit('game:leave', game, player);
}

async function dealCards(game, player) {
  const choices = await game.getChoices({
    where: { available: true },
    limit: game.cardsPerPlayer - await player.countCards(),
  });

  await Choice.update({ playerId: player.id, available: false }, {
    where: {
      id: { [Op.in]: choices.map(c => c.id) },
    },
  });

  return choices;
}

async function pickQuestion(game) {
  const question = (await game.getQuestions({
    where: { available: true },
    limit: 1,
  }))[0];

  if (!question)
    return false;

  await question.update({ available: false });
  await game.setCurrentQuestion(question);

  return true;
}

async function start(game) {
  const qm = (await game.getPlayers({
    order: Sequelize.fn('RANDOM'),
    limit: 1,
  }))[0];

  await game.createCards();
  await pickQuestion(game);
  await game.setQuestionMaster(qm);

  const players = await game.getPlayers();

  for (let i = 0; i < players.length; ++i) {
    const player = players[i];
    const choices = await dealCards(game, player);

    events.emit('player:cards', player, choices, { initial: true });
  }

  await game.update({ state: 'started' });

  events.emit('game:start', game);
}

async function answer(game, player, choices) {
  const answer = await game.createAnswer({
    playerId: player.id,
    questionId: game.questionId,
  });

  await Choice.update({ answerId: answer.id, playerId: null }, {
    where: {
      id: { [Op.in]: choices.map(c => c.id) },
    },
  });

  if (await game.getPlayState() === 'question_master_selection') {
    const propositions = shuffle(await game.getPropositions());

    for (let i = 0; i < propositions.length; ++i)
      await propositions[i].update({ place: i + 1 });
  }

  events.emit('game:answer', game, player, answer);
}

async function select(game, player, answer) {
  await game.setSelectedAnswer(answer);
  events.emit('game:select', game, player, answer);
}

async function nextTurn(game) {
  const players = await game.getPlayers();
  const answer = await game.getSelectedAnswer({ include: ['player'] });
  const winner = answer.player;

  const turn = await game.createTurn({
    number: await game.countTurns() + 1,
    questionId: game.questionId,
    questionMasterId: game.questionMasterId,
    winnerId: winner.id,
  });

  await Answer.update({
    gameTurnId: turn.id,
  }, {
    where: { questionId: game.questionId },
  });

  events.emit('game:turn', game, turn);

  await game.setSelectedAnswer(null);
  if (!await pickQuestion(game)) {
    await end(game);
    return;
  }

  await game.setQuestionMaster(winner);

  for (let i = 0; i < players.length; ++i) {
    const player = players[i];
    const choices = await dealCards(game, player);

    if (choices.length > 0)
      events.emit('player:cards', player, choices);
  }

  events.emit('game:next', game);
}

async function end(game) {
  await game.update({
    state: 'finished',
    questionMasterId: null,
    selectedAnswerId: null,
    questionId: null,
  });

  events.emit('game:end', game);
}

module.exports = {
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
