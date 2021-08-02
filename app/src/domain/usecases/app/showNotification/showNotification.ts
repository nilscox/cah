import { createThunk } from '../../../../store/createThunk';
import { clearNotification, setNotification } from '../../../actions';

export const showNotification = createThunk(({ dispatch, timerGateway }, text: string) => {
  dispatch(setNotification(text));

  timerGateway.setTimeout(() => {
    dispatch(clearNotification());
  }, 7000);
});
