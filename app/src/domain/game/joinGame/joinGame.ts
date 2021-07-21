import { ThunkResult } from '../../../store/createAction';
import { setGame } from '../../actions';

export const joinGame = (gameCode: string): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { gameGateway, routerGateway }) => {
    const game = await gameGateway.joinGame(gameCode);

    dispatch(setGame(game));
    routerGateway.push(`/game/${game.code}`);
  };
};
