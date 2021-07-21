import { ThunkResult } from '../../../store/createAction';
import { setConnected } from '../../actions';

export const connect = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { rtcGateway }) => {
    await rtcGateway.connect();

    dispatch(setConnected());
  };
};
