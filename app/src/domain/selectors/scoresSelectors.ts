import { first } from '../../shared/first';
import { hasId } from '../../shared/has-id';
import { selectGamePlayer, selectPlayers, selectTurns } from '../../store/slices/game/game.selectors';
import { AppState } from '../../store/types';
import { GamePlayer, Score } from '../entities/game';

export const selectScores = (state: AppState): Array<Score> => {
  const turns = selectTurns(state);
  const players = selectPlayers(state).slice();
  const scores = new Map(players.map((player) => [player.id, 0]));

  for (const { winner } of turns) {
    // the player have left
    if (!scores.has(winner)) {
      scores.set(winner, 0);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    scores.set(winner, scores.get(winner)! + 1);
  }

  return Array.from(scores.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([id, score]) => [selectGamePlayer(state, id), score]);
};

export const selectBestScore = (state: AppState): number | null => {
  const turns = selectTurns(state);
  const scores = selectScores(state);

  if (!turns.length) {
    return null;
  }

  const best = first(scores) as Score;

  return best[1];
};

export const selectGameWinners = (state: AppState): GamePlayer[] | null => {
  const scores = selectScores(state);
  const bestScore = selectBestScore(state);

  if (bestScore == null) {
    return null;
  }

  return scores.filter(([, score]) => score === bestScore).map(([player]) => player);
};

export const selectScoresExcludingWinners = (state: AppState) => {
  const scores = selectScores(state);
  const winners = selectGameWinners(state);

  if (winners === null) {
    return null;
  }

  const isWinner = (player: GamePlayer) => winners.some(hasId(player.id));

  return scores.filter(([player]) => !isWinner(player));
};
