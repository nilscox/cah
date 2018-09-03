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
