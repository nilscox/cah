import { createThunk } from '../../../../store/createThunk';
import { setGame } from '../../../actions';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const createGame = createThunk(async ({ dispatch, gameGateway }) => {
  const game = await gameGateway.createGame();

  dispatch(setGame(game));
  dispatch(navigateToGameRoute('/idle'));
});
