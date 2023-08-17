import { FetchError } from '@cah/client';

import { normalizeCurrentPlayer } from '../../normalization';
import { createAction } from '../../store/create-action';
import { createThunk } from '../../store/create-thunk';

export const fetchPlayer = createThunk(async ({ dispatch, client }) => {
  try {
    const player = await client.getAuthenticatedPlayer();

    dispatch(playerFetched(player));

    client.connect('/api/socket.io');
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      return;
    } else {
      throw error;
    }
  }
});

export const playerFetched = createAction('player-fetched', normalizeCurrentPlayer);
