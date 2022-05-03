import { GameLeftEvent } from '../../../../../../shared/events';
import { hasId } from '../../../../shared/has-id';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { selectPlayers } from '../../../../store/slices/game/game.selectors';
import { selectPlayer } from '../../../../store/slices/player/player.selectors';
import { showNotification } from '../../app/showNotification/showNotification';

export const handleGameLeft = createThunk(({ dispatch, getState }, event: GameLeftEvent) => {
  const currentPlayer = selectPlayer(getState());
  const playerToRemove = selectPlayers(getState()).find(hasId(event.player));

  if (!playerToRemove) {
    return;
  }

  dispatch(gameActions.removePlayer(playerToRemove));

  if (currentPlayer.id !== playerToRemove.id) {
    dispatch(showNotification(playerToRemove.nick + ' a quitté la partie'));
  }
});
