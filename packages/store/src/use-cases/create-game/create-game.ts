import { normalizeGame } from '../../normalization';
import { createThunk } from '../../store/create-thunk';

export const createGame = createThunk('create-game', async ({ client }) => {
  const gameId = await client.createGame();
  const game = await client.getGame(gameId);

  return normalizeGame(game);
});
