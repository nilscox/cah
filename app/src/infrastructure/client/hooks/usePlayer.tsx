import { useSelector } from 'react-redux';

import { Player } from '../../../domain/entities/Player';
import { AppState } from '../../../store/types';

const playerSelector = (state: AppState) => state.player as Player;

export const usePlayer = () => {
  return useSelector(playerSelector);
};
