import { createThunk } from '../../../../store/createThunk';
import { setGame } from '../../../actions';
import { navigate } from '../../app/navigate/navigate';

export const leaveGame = createThunk(async ({ dispatch, gameGateway }) => {
  await gameGateway.leaveGame();

  dispatch(navigate('/'));
  dispatch(setGame(null));
});
