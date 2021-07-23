import { createThunk } from '../../../../store/createThunk';
import { rtcMessage, setConnected } from '../../../actions';

export const connect = createThunk(async ({ dispatch, rtcGateway }) => {
  await rtcGateway.connect();

  rtcGateway.onMessage((message) => dispatch(rtcMessage(message)));

  dispatch(setConnected());
});
