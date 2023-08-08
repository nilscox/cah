import { createThunk2 } from '../../store/create-thunk';
import { fetchGame } from '../fetch-game/fetch-game';

export const createGame = createThunk2(async ({ dispatch, client }) => {
  const gameId = await client.createGame();

  await dispatch(fetchGame(gameId));
});
