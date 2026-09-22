import { normalizeGame } from '../../normalization.ts';
import { createAction } from '../../store/create-action.ts';
import { createThunk } from '../../store/create-thunk.ts';

export const fetchGame = createThunk(async ({ dispatch, client }, gameId: string) => {
  const game = await client.getGame(gameId);

  dispatch(gameFetched(game));
});

export const gameFetched = createAction('game-fetched', normalizeGame);
