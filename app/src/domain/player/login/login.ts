import { ThunkResult } from '../../../store/createAction';
import { setPlayer } from '../../actions';

export const login = (nick: string): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { playerGateway, routerGateway }) => {
    const player = await playerGateway.login(nick);

    dispatch(setPlayer(player));
    routerGateway.push('/');
  };
};
