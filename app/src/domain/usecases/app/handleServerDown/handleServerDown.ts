import { createThunk } from '../../../../store/createThunk';
import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { serverStatusChanged } from '../../../actions';
import { initialize } from '../../player/initialize/initialize';

const checkInterval = 1000;

const healthcheck = createThunk(async ({ getState, dispatch, serverGateway }) => {
  const status = await serverGateway.healthcheck();

  if (getState().app.server !== status) {
    dispatch(serverStatusChanged(status));
  }

  return status;
});

const checkServerStatus = createThunk(async ({ dispatch, timerGateway }) => {
  const status = await dispatch(healthcheck());

  if (status === NetworkStatus.up) {
    return;
  }

  const interval = timerGateway.setInterval(async () => {
    const status = await dispatch(healthcheck());

    if (status === NetworkStatus.up) {
      timerGateway.clearInterval(interval);
      await dispatch(initialize());
    }
  }, checkInterval);
});

export const handleServerDown = createThunk(({ dispatch, getState }) => {
  if (getState().app.server !== NetworkStatus.down) {
    dispatch(serverStatusChanged(NetworkStatus.down));
    dispatch(checkServerStatus());
  }
});
