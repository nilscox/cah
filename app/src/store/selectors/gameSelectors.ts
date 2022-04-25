import { AnonymousAnswer, Answer, isNotAnonymous } from '../../domain/entities/Answer';
import { StartedGame } from '../../domain/entities/Game';
import { AppState } from '../types';

import { selectIsGameCreator } from './playerSelectors';

export const selectGameUnsafe = (state: AppState) => state.game;

export const selectGame = (state: AppState) => {
  const game = selectGameUnsafe(state);

  if (!game) {
    throw new Error('selectGame: game is null');
  }

  return game as StartedGame;
};

export const selectCurrentQuestion = (state: AppState) => selectGame(state).question;

export const selectTurns = (state: AppState) => {
  return selectGame(state).turns;
};

export const selectPlayState = (state: AppState) => {
  return selectGame(state).playState;
};

export const selectPlayers = (state: AppState) => {
  return selectGame(state).players;
};

export const selectIsLastTurn = (state: AppState) => {
  const game = selectGame(state);
  const turns = selectTurns(state);

  return turns.length === game.totalQuestions - 1;
};

export const selectCanStartGame = (state: AppState) => {
  const game = selectGame(state);
  const isCreator = selectIsGameCreator(state);

  return isCreator && game.players.length >= 3;
};

export const selectIsWinningAnswer = (state: AppState) => {
  const game = selectGame(state);

  return (answer: AnonymousAnswer | Answer): boolean => {
    if (!game.winner || !isNotAnonymous(answer)) {
      return false;
    }

    return game.winner.id === answer.player.id;
  };
};
