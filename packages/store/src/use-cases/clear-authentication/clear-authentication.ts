import { playerActions } from '../../slices/player/player.slice';
import { createThunk } from '../../store/create-thunk';

export const clearAuthentication = createThunk('clear-authentication', async ({ dispatch, client }) => {
  await client.clearAuthentication();
  dispatch(playerActions.unsetPlayer());
});
