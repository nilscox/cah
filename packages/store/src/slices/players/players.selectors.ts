import { type AppState } from '../../types.ts';

import { playersAdapter } from './players.slice.ts';

export const {
  selectAll: selectAllPlayers,
  selectEntities: selectPlayers,
  selectById: selectPlayerById,
} = playersAdapter.getSelectors((state: AppState) => state.players);
