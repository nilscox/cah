import { useSelector } from 'react-redux';

import { AppState } from '../../../store/types';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const gameSelector = (state: AppState) => state.game!;

export const useGame = () => {
  return useSelector(gameSelector);
};
