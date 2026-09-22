import { createThunk } from '../../store/create-thunk.ts';
import { fetchGame } from '../fetch-game/fetch-game.ts';

export const joinGame = createThunk(async ({ dispatch, client }, code: string) => {
  const gameId = await client.joinGame(code);

  await dispatch(fetchGame(gameId));
});
