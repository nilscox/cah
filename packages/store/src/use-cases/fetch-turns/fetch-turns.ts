import { normalizeTurns } from '../../normalization.ts';
import { createAction } from '../../store/create-action.ts';
import { createThunk } from '../../store/create-thunk.ts';

export const fetchTurns = createThunk(async ({ dispatch, client }, gameId: string) => {
  const turns = await client.getGameTurns(gameId);

  dispatch(turnsFetched(turns));
});

export const turnsFetched = createAction('turns-fetched', normalizeTurns);
