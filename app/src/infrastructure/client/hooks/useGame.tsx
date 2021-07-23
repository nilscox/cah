import { useSelector } from 'react-redux';

import { StartedGame } from '../../../interfaces/entities/Game';
import { AppState } from '../../../store/types';

const gameSelector = (state: AppState) => state.game as StartedGame;

export const useGame = () => {
  return useSelector(gameSelector);
};
