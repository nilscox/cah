import { useSelector } from 'react-redux';

import { Choice } from '../../../domain/entities/Choice';
import { PlayerState } from '../../../store/reducers/playerReducer';
import { AppState, NotNull } from '../../../store/types';

import { gameSelector } from './useGame';

export const playerSelector = (state: AppState) => state.player as NotNull<PlayerState>;
export const playerCardsSelector = (state: AppState) => playerSelector(state).cards;

export const isQuestionMasterSelector = (state: AppState) => {
  const game = gameSelector(state);
  const player = playerSelector(state);

  return game.questionMaster.nick === player.nick;
};

export const choicesSelectionSelector = (state: AppState) => {
  return playerSelector(state).selection.filter((choice): choice is Choice => choice !== null);
};

export const usePlayer = () => {
  return useSelector(playerSelector);
};
