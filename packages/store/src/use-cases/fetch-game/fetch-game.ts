import { normalizeGame } from '../../normalization';
import { createAction } from '../../store/create-action';
import { createThunk } from '../../store/create-thunk';

export const fetchGame = createThunk(async ({ dispatch, client }, gameId: string) => {
  const game = await client.getGame(gameId);

  dispatch(gameFetched(game));
});

export const gameFetched = createAction('game-fetched', normalizeGame);
