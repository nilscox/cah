import { FetchError } from '@cah/client';

import { normalizeCurrentPlayer } from '../../normalization.ts';
import { createAction } from '../../store/create-action.ts';
import { createThunk } from '../../store/create-thunk.ts';

export const fetchPlayer = createThunk(async ({ dispatch, client, config }) => {
  try {
    const player = await client.getAuthenticatedPlayer();

    dispatch(playerFetched(player));

    await Promise.race([
      client.connect(config.apiUrl, config.websocketPath),
      new Promise((resolve) => setTimeout(resolve, 2000)).then(onTimeout),
    ]);
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      return;
    } else {
      throw error;
    }
  }
});

const onTimeout = () => {
  throw new Error('Websocket connect timeout');
};

export const playerFetched = createAction('player-fetched', normalizeCurrentPlayer);
