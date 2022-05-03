import { PlayerDisconnectedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';

export const handlePlayerDisconnected = createThunk(({ dispatch }, event: PlayerDisconnectedEvent) => {
  dispatch(gameActions.updatePlayer(event.player, { isConnected: false }));
});
