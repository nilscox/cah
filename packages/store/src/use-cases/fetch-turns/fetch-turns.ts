import { normalizeTurns } from '../../normalization';
import { createAction } from '../../store/create-action';
import { createThunk } from '../../store/create-thunk';

export const fetchTurns = createThunk(async ({ dispatch, client }, gameId: string) => {
  const turns = await client.getGameTurns(gameId);

  dispatch(turnsFetched(turns));
});

export const turnsFetched = createAction('turns-fetched', normalizeTurns);
