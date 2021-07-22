import { createThunk } from '../../../store/createThunk';
import { setGame } from '../../actions';

export const createGame = createThunk(async ({ dispatch, gameGateway, routerGateway }) => {
  const game = await gameGateway.createGame();

  dispatch(setGame(game));
  routerGateway.push(`/game/${game.code}`);
});
