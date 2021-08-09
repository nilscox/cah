import { Choice } from '../../domain/entities/Choice';
import { PlayState } from '../../domain/entities/Game';
import { PlayerState } from '../reducers/playerReducer';
import { AppState, NotNull } from '../types';

import { selectGame, selectPlayState } from './gameSelectors';

export const selectPlayer = (state: AppState) => state.player as NotNull<PlayerState>;

export const selectPlayerCards = (state: AppState) => selectPlayer(state).cards;

export const selectIsGameCreator = (state: AppState) => {
  const game = selectGame(state);
  const player = selectPlayer(state);

  return game.creator?.nick === player.nick;
};

export const selectIsQuestionMaster = (state: AppState) => {
  const game = selectGame(state);
  const player = selectPlayer(state);

  return game.questionMaster?.nick === player.nick;
};

export const selectChoicesSelection = (state: AppState) => {
  return selectPlayer(state).selection.filter((choice): choice is Choice => choice !== null);
};

export const selectCanFlushCards = (state: AppState) => {
  const player = selectPlayer(state);

  if (selectPlayState(state) !== PlayState.playersAnswer) {
    return false;
  }

  if (player.selectionValidated) {
    return false;
  }

  return !player.hasFlushed;
};
