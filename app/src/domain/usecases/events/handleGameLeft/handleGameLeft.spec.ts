import expect from 'expect';

import { PlayerDto } from '../../../../../../shared/dtos';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { selectPlayers } from '../../../../store/slices/game/game.selectors';
import { createId } from '../../../../tests/create-id';
import { createPlayer } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleGameLeft', () => {
  const player = createPlayer();

  const leavingPlayer: PlayerDto = {
    id: createId(),
    isConnected: false,
    nick: 'leaving player',
  };

  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer(player))
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .getStore();

  beforeEach(() => {
    store.dispatch(gameActions.addPlayer(leavingPlayer));
  });

  it('removes the new player from the game', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'GameLeft',
        player: leavingPlayer.id,
      }),
    );

    expect(store.select(selectPlayers)).not.toContainEqual({
      id: leavingPlayer.id,
      isConnected: false,
      nick: 'leaving player',
    });
  });

  it('shows a notification', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'GameLeft',
        player: leavingPlayer.id,
      }),
    );

    expect(store.app.notification).toEqual('leaving player a quitté la partie');
  });

  it('does not show a notification when the player himself leaves the game', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'GameLeft',
        player: player.id,
      }),
    );

    expect(store.app.notification).toBeUndefined();
  });
});
