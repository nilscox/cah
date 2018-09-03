export const questionLength = (question, choices) => {
  return question.text.length + choices.reduce((a, c) => a + (c ? c.text.length : 10), 0);
};

export const getScoresFromHistory = (game, history) => {
  const scores = {};

  history.forEach(turn => {
    if (!scores[turn.winner])
      scores[turn.winner] = 0;

    scores[turn.winner]++;
  });

  return Object.keys(scores)
    .sort((a, b) => scores[b] - scores[a])
    .map(nick => ({
      nick,
      ...(game.players.find(p => p.nick === nick) || {}),
      score: scores[nick],
    }));
};

export const getInstruction = (player, game) => {
  if (game.state === 'idle') {
    if (player.nick === game.owner)
      return 'Press start when the game is ready';
    else
      return 'Wait for the game owner to start the game';
  }

  if (game.state === 'finished')
    return 'The Game.';

  const isQM = game.questionMaster === player.nick;

  if (game.playState === 'players_answer') {
    if (isQM)
      return 'Wait for all players to submit their answer';
    else {
      console.log(player.submitted);
      if (player.submitted)
        return 'Wait for other players to submit their answer';
      else
        return 'Submit an answer';
    }
  }

  if (game.playState === 'question_master_selection') {
    if (isQM)
      return 'Select an answer';
    else
      return 'Wait for the question master to select an answer';
  }

  if (game.playState === 'end_of_turn') {
    if (isQM)
      return 'Press next to continue';
    else
      return 'Wait for the question master to continue';
  }

  throw new Error('should never happen');
};
