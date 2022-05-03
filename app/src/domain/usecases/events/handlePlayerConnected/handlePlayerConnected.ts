import { PlayerConnectedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';

export const handlePlayerConnected = createThunk(({ dispatch }, event: PlayerConnectedEvent) => {
  dispatch(gameActions.updatePlayer(event.player, { isConnected: true }));
});
