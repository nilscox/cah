import { gameActions } from '../../slices/game/game.slice';
import { playerActions } from '../../slices/player/player.slice';
import { createThunk2 } from '../../store/create-thunk';

export const clearAuthentication = createThunk2(async ({ dispatch, client }) => {
  await client.clearAuthentication();
  dispatch(gameActions.unsetGame());
  dispatch(playerActions.unsetPlayer());
});
