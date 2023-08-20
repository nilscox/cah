import { FetchError } from '@cah/client';

import { normalizeCurrentPlayer } from '../../normalization';
import { createAction } from '../../store/create-action';
import { createThunk } from '../../store/create-thunk';

export const fetchPlayer = createThunk(async ({ dispatch, client, config }) => {
  try {
    const player = await client.getAuthenticatedPlayer();

    dispatch(playerFetched(player));

    client.connect(config.apiUrl, config.websocketPath);
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      return;
    } else {
      throw error;
    }
  }
});

export const playerFetched = createAction('player-fetched', normalizeCurrentPlayer);
