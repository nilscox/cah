import { useSelector } from 'react-redux';

import { StartedGame } from '../../../domain/entities/Game';
import { AppState } from '../../../store/types';

export const gameSelector = (state: AppState) => state.game as StartedGame;
export const currentQuestionSelector = (state: AppState) => gameSelector(state).question;

export const useGame = () => {
  return useSelector(gameSelector);
};
