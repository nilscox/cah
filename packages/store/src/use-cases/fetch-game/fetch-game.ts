import { normalizeGame } from '../../normalization';
import { createAction } from '../../store/create-action';
import { createThunk2 } from '../../store/create-thunk';

export const fetchGame = createThunk2(async ({ dispatch, client }, gameId: string) => {
  const game = await client.getGame(gameId);

  dispatch(gameFetched(game));
});

export const gameFetched = createAction('game-fetched', normalizeGame);
