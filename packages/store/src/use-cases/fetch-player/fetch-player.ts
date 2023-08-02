import { FetchError } from '@cah/client';

import { normalizePlayer } from '../../normalization';
import { createThunk } from '../../store/create-thunk';

export const fetchPlayer = createThunk('fetch-player', async ({ client }) => {
  try {
    const player = await client.getAuthenticatedPlayer();

    client.connect();

    return normalizePlayer(player);
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      return undefined;
    } else {
      throw error;
    }
  }
});
