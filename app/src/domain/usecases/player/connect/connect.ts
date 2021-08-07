import { createThunk } from '../../../../store/createThunk';
import { setConnected } from '../../../actions';
import { handleRTCMessage } from '../../game/handleRTCMessage/handleRTCMessage';

export const connect = createThunk(async ({ dispatch, rtcGateway }) => {
  await rtcGateway.connect();

  rtcGateway.onMessage((message) => dispatch(handleRTCMessage(message)));

  dispatch(setConnected());
});
