import { GameJoinedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { selectPlayer } from '../../../../store/slices/player/player.selectors';
import { showNotification } from '../../app/showNotification/showNotification';

export const handleGameJoined = createThunk(({ dispatch, getState }, event: GameJoinedEvent) => {
  const currentPlayer = selectPlayer(getState());

  dispatch(gameActions.addPlayer(event.player));

  if (currentPlayer.id !== event.player.id) {
    dispatch(showNotification(event.player.nick + ' a rejoint la partie'));
  }
});
