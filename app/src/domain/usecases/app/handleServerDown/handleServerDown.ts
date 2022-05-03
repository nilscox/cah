import { createThunk } from '../../../../store/createThunk';
import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { appActions } from '../../../../store/slices/app/app.actions';
import { selectServerStatus } from '../../../../store/slices/app/app.selectors';
import { initialize } from '../../app/initialize/initialize';

const checkInterval = 1000;

const healthcheck = createThunk(async ({ getState, dispatch, serverGateway }) => {
  const status = await serverGateway.healthcheck();

  if (getState().app.server !== status) {
    dispatch(appActions.setServerStatus(status));
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
  const serverStatus = selectServerStatus(getState());

  if (serverStatus !== NetworkStatus.down) {
    dispatch(appActions.setServerStatus(NetworkStatus.down));
    dispatch(checkServerStatus());
  }
});
