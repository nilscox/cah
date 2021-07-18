import { ThunkResult } from '../../../store/createAction';
import { setPlayer } from '../login/login';

export const fetchMe = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { playerGateway }) => {
    const player = await playerGateway.fetchMe();

    if (player) {
      dispatch(setPlayer(player));
    }
  };
};
