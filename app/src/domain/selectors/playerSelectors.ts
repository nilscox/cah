import { PlayState } from '../../domain/entities/game';
import { selectGame, selectStartedGame } from '../../store/slices/game/game.selectors';
import { selectPlayerGame } from '../../store/slices/player/player.selectors';
import { AppState } from '../../store/types';

export const selectPlayerUnsafe = (state: AppState) => state.player;

export const selectPlayer = (state: AppState) => {
  const player = selectPlayerUnsafe(state);

  if (player === null) {
    throw new Error('selectPlayer: player is null');
  }

  return player;
};

export const selectIsGameCreator = (state: AppState) => {
  const game = selectGame(state);
  const player = selectPlayer(state);

  return game.creator === player.id;
};

export const selectIsQuestionMaster = (state: AppState) => {
  const game = selectStartedGame(state);
  const player = selectPlayer(state);

  return game.questionMaster === player.id;
};

export const selectCanFlushCards = (state: AppState) => {
  const playerGame = selectPlayerGame(state);

  if (selectStartedGame(state).playState !== PlayState.playersAnswer) {
    return false;
  }

  if (playerGame.selectionValidated) {
    return false;
  }

  return !playerGame.hasFlushed;
};
