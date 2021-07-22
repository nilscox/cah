import { createThunk } from '../../../store/createThunk';
import { setGame } from '../../actions';

export const joinGame = createThunk(async ({ dispatch, gameGateway, routerGateway }, gameCode: string) => {
  const game = await gameGateway.joinGame(gameCode);

  dispatch(setGame(game));
  routerGateway.push(`/game/${game.code}`);
});
