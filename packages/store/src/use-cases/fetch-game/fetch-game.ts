import { normalizeGame } from '../../normalization';
import { createThunk2 } from '../../store/create-thunk';
import { setEntities } from '../../store/set-entities';

export const fetchGame = createThunk2(async ({ dispatch, client }, gameId: string) => {
  const game = await client.getGame(gameId);

  dispatch(setEntities(normalizeGame(game)));
});
