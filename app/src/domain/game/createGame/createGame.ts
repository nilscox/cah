import { ThunkResult } from '../../../store/createAction';
import { setGame } from '../../actions';

export const createGame = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { gameGateway, routerGateway }) => {
    const game = await gameGateway.createGame();

    dispatch(setGame(game));
    routerGateway.push(`/game/${game.code}`);
  };
};
