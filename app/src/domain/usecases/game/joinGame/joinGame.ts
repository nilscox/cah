import { createThunk } from '../../../../store/createThunk';
import { setGame } from '../../../actions';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const joinGame = createThunk(async ({ dispatch, gameGateway }, gameCode: string) => {
  const game = await gameGateway.joinGame(gameCode);

  dispatch(setGame(game));
  dispatch(navigateToGameRoute('/idle'));
});
