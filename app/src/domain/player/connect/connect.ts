import { ThunkResult } from '../../../store/createAction';
import { rtcMessage, setConnected } from '../../actions';

export const connect = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { rtcGateway }) => {
    await rtcGateway.connect();

    rtcGateway.onMessage((message) => dispatch(rtcMessage(message)));

    dispatch(setConnected());
  };
};
