import { createThunk } from '../../store/create-thunk.ts';
import { fetchGame } from '../fetch-game/fetch-game.ts';

export const createGame = createThunk(async ({ dispatch, client }) => {
  const gameId = await client.createGame();

  await dispatch(fetchGame(gameId));
});
