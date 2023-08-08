import { FetchError } from '@cah/client';

import { normalizePlayer } from '../../normalization';
import { createAction } from '../../store/create-action';
import { createThunk2 } from '../../store/create-thunk';

export const fetchPlayer = createThunk2(async ({ dispatch, client }) => {
  try {
    const player = await client.getAuthenticatedPlayer();

    dispatch(playerFetched(player));

    client.connect();
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      return;
    } else {
      throw error;
    }
  }
});

export const playerFetched = createAction('player-fetched', normalizePlayer);
