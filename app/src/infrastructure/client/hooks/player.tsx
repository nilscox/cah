import { useSelector } from 'react-redux';

import { AppState } from '../../../store/types';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const playerSelector = (state: AppState) => state.player!;

export const usePlayer = () => {
  return useSelector(playerSelector);
};
