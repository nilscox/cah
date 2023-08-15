import { AppState } from '../../types';

import { playersAdapter } from './players.slice';

export const { selectAll: selectAllPlayers, selectById: selectPlayerById } = playersAdapter.getSelectors(
  (state: AppState) => state.players,
);
