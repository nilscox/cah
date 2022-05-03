import { createThunk } from '../../../../store/createThunk';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { handleRTCMessage } from '../../events/handleRTCMessage/handleRTCMessage';

export const connect = createThunk(async ({ dispatch, rtcGateway }) => {
  await rtcGateway.connect();

  rtcGateway.onMessage((message) => dispatch(handleRTCMessage(message)));

  dispatch(playerActions.setPlayerConnected());
});
