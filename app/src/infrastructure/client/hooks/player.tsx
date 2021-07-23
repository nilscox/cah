import { useSelector } from 'react-redux';

import { Player } from '../../../interfaces/entities/Player';
import { AppState } from '../../../store/types';

const playerSelector = (state: AppState) => state.player as Player;

export const usePlayer = () => {
  return useSelector(playerSelector);
};
