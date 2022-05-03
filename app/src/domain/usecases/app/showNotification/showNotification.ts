import { createThunk } from '../../../../store/createThunk';
import { appActions } from '../../../../store/slices/app/app.actions';

const NOTIFICATION_TIMEOUT = 3400;

export const showNotification = createThunk(({ dispatch, timerGateway }, text: string) => {
  dispatch(appActions.setNotification(text));

  timerGateway.setTimeout(() => {
    dispatch(appActions.clearNotification());
  }, NOTIFICATION_TIMEOUT);
});
