import { normalizeGame } from '../../normalization';
import { createThunk } from '../../store/create-thunk';

export const fetchGame = createThunk('fetch-game', async ({ client }, gameId: string) => {
  const game = await client.getGame(gameId);

  return normalizeGame(game);
});
