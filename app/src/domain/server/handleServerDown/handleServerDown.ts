import { ThunkResult } from '../../../store/createAction';
import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { serverStatusChanged } from '../../actions';
import { initialize } from '../../player/initialize/initialize';

const checkInterval = 1000;

const healthcheck =
  (): ThunkResult<Promise<ServerStatus>> =>
  async (dispatch, getState, { serverGateway }) => {
    const status = await serverGateway.healthcheck();

    if (getState().app.server !== status) {
      dispatch(serverStatusChanged(status));
    }

    return status;
  };

const checkServerStatus = (): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { timerGateway }) => {
    const status = await dispatch(healthcheck());

    if (status === ServerStatus.up) {
      return;
    }

    const interval = timerGateway.setInterval(async () => {
      const status = await dispatch(healthcheck());

      if (status === ServerStatus.up) {
        timerGateway.clearInterval(interval);
        dispatch(initialize());
      }
    }, checkInterval);
  };
};

export const handleServerDown = (): ThunkResult<void> => {
  return (dispatch, getState) => {
    if (getState().app.server !== ServerStatus.down) {
      dispatch(serverStatusChanged(ServerStatus.down));
      dispatch(checkServerStatus());
    }
  };
};
