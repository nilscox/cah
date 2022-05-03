import { AnonymousAnswer, Answer, isNotAnonymous } from '../../domain/entities/Answer';
import { selectPlayers, selectStartedGame, selectTurns } from '../../store/slices/game/game.selectors';
import { AppState } from '../../store/types';

import { selectIsGameCreator } from './playerSelectors';

export const selectCanStartGame = (state: AppState) => {
  const players = selectPlayers(state);
  const isCreator = selectIsGameCreator(state);

  return isCreator && players.length >= 3;
};

export const selectIsLastTurn = (state: AppState) => {
  const game = selectStartedGame(state);
  const turns = selectTurns(state);

  return turns.length === game.totalQuestions - 1;
};

export const selectIsWinningAnswer = (state: AppState) => {
  const game = selectStartedGame(state);

  return (answer: AnonymousAnswer | Answer): boolean => {
    if (!game.winner || !isNotAnonymous(answer)) {
      return false;
    }

    return game.winner === answer.player;
  };
};
