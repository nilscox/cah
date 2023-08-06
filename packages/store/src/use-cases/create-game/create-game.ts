import { normalizeGame } from '../../normalization';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk2 } from '../../store/create-thunk';
import { setEntities } from '../../store/set-entities';

export const createGame = createThunk2(async ({ dispatch, client }) => {
  const gameId = await client.createGame();
  const game = await client.getGame(gameId);

  dispatch(setEntities(normalizeGame(game)));
  dispatch(playerActions.setGameId(gameId));
});
