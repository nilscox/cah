import { ThunkResult } from '../../../store/createAction';
import { setAppReady, setGame, setPlayer } from '../../actions';

export const fetchMe = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { playerGateway, gameGateway }) => {
    const player = await playerGateway.fetchMe();

    if (player) {
      dispatch(setPlayer(player));

      if (player.gameId) {
        const game = await gameGateway.fetchGame(player.gameId);

        if (game) {
          dispatch(setGame(game));
        }
      }
    }

    dispatch(setAppReady());
  };
};
