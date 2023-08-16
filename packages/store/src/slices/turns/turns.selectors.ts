import { defined } from '@cah/utils';
import { combine } from '@nilscox/selektor';

import { AppState } from '../../types';
import { selectAnswers } from '../answers/answers.selectors';
import { selectAllPlayers, selectPlayers } from '../players/players.selectors';

import { turnsAdapter } from './turns.slice';

export const { selectAll: selectTurns } = turnsAdapter.getSelectors((state: AppState) => state.turns);

export const selectScores = combine(
  selectTurns,
  selectAnswers,
  selectAllPlayers,
  (turns, answers, players) => {
    const scores = new Map<string, number>(players.map((player) => [player.id, 0]));

    for (const turn of turns) {
      const answer = answers[turn.selectedAnswerId];
      const winnerId = defined(answer.playerId);

      scores.set(winnerId, defined(scores.get(winnerId)) + 1);
    }

    return scores;
  },
);

export const selectWinners = combine(selectScores, selectPlayers, (scores, players) => {
  const bestScore = Math.max(...scores.values());

  return Array.from(scores.entries())
    .filter(([, score]) => score === bestScore)
    .map(([playerId]) => players[playerId]);
});
