import { createThunk } from '../../../../store/createThunk';
import { selectPlayer, selectPlayerCards } from '../../../../store/selectors/playerSelectors';
import { rtcMessage } from '../../../actions';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { navigateToGameRoute } from '../../app/navigate/navigate';
import { showNotification } from '../../app/showNotification/showNotification';
import { setCards } from '../../player/setCards/setCards';

export const handleRTCMessage = createThunk(({ dispatch, getState }, message: RTCMessage) => {
  const state = getState();

  const player = selectPlayer(state);

  if (message.type === 'CardsDealt') {
    const cards = selectPlayerCards(state);

    dispatch(setCards([...cards, ...message.cards]));
  }

  if (message.type === 'GameJoined') {
    if (message.player.id !== player.id) {
      dispatch(showNotification(message.player.nick + ' a rejoint la partie'));
    }
  }

  if (message.type === 'GameLeft') {
    dispatch(showNotification(message.player + ' a quitté la partie'));
  }

  if (message.type === 'TurnStarted') {
    dispatch(navigateToGameRoute('/started/answer-question'));
  }

  if (message.type === 'AllPlayersAnswered') {
    dispatch(navigateToGameRoute('/started/winner-selection'));
  }

  if (message.type === 'WinnerSelected') {
    dispatch(navigateToGameRoute('/started/end-of-turn'));
  }

  if (message.type === 'GameFinished') {
    dispatch(navigateToGameRoute('/finished', { animations: true }));
  }

  dispatch(rtcMessage(message));
});
