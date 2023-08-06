import { FetchError } from '@cah/client';
import { getIds } from '@cah/utils';

import { normalizePlayer } from '../../normalization';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk2 } from '../../store/create-thunk';
import { setEntities } from '../../store/set-entities';

export const fetchPlayer = createThunk2(async ({ dispatch, client }) => {
  try {
    const player = await client.getAuthenticatedPlayer();

    client.connect();

    dispatch(setEntities(normalizePlayer(player)));

    dispatch(
      playerActions.setPlayer({
        id: player.id,
        nick: player.nick,
        gameId: player.gameId,
        cardsIds: player.cards ? getIds(player.cards) : undefined,
        selectedChoicesIds: player.gameId ? [] : undefined,
      }),
    );
  } catch (error) {
    if (error instanceof FetchError && error.status === 401) {
      return;
    } else {
      throw error;
    }
  }
});
