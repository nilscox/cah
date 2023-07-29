import { AppState } from '../../types';

import { playersAdapter } from './players.slice';

const { selectAll: all } = playersAdapter.getSelectors((state: AppState) => state.players);

export const playersSelectors = {
  all,
};
