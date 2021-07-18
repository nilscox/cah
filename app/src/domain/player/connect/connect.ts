import { createAction, ThunkResult } from '../../../store/createAction';

export const setConnected = createAction('player/set-connected');

export const connect = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { rtcGateway }) => {
    await rtcGateway.connect();

    dispatch(setConnected());
  };
};
