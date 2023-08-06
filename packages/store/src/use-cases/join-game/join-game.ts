import { normalizeGame } from '../../normalization';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk2 } from '../../store/create-thunk';
import { setEntities } from '../../store/set-entities';

export const joinGame = createThunk2(async ({ dispatch, client }, code: string) => {
  const gameId = await client.joinGame(code);
  const game = await client.getGame(gameId);

  dispatch(setEntities(normalizeGame(game)));
  dispatch(playerActions.setGameId(gameId));
});
