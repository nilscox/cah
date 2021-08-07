import { createThunk } from '../../../../store/createThunk';
import { rtcMessage } from '../../../actions';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const handleRTCMessage = createThunk(({ dispatch }, message: RTCMessage) => {
  dispatch(rtcMessage(message));

  if (message.type === 'TurnStarted') {
    dispatch(navigateToGameRoute(`/started/answer-question`));
  }

  if (message.type === 'AllPlayersAnswered') {
    dispatch(navigateToGameRoute(`/started/winner-selection`));
  }

  if (message.type === 'WinnerSelected') {
    dispatch(navigateToGameRoute(`/started/end-of-turn`));
  }
});
