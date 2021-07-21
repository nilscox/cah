import { ThunkResult } from '../../../store/createAction';
import { setGame } from '../../actions';

export const createGame = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { gameGateway }) => {
    const game = await gameGateway.createGame();

    dispatch(setGame(game));
  };
};
