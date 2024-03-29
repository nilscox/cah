import { createThunk } from '../../store/create-thunk';
import { fetchGame } from '../fetch-game/fetch-game';

export const joinGame = createThunk(async ({ dispatch, client }, code: string) => {
  const gameId = await client.joinGame(code);

  await dispatch(fetchGame(gameId));
});
