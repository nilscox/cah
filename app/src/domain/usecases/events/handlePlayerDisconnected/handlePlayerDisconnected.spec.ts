import expect from 'expect';

import { selectGamePlayer } from '../../../../store/slices/game/game.selectors';
import { createPlayer } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handlePlayerDisconnected', () => {
  const player = createPlayer({ isConnected: true });
  const store = new TestBuilder().apply(TestBuilder.setPlayer(player)).apply(TestBuilder.createGame()).getStore();

  it('sets the player as connected', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'PlayerDisconnected',
        player: player.id,
      }),
    );

    expect(store.select(selectGamePlayer, player.id)).toHaveProperty('isConnected', false);
  });
});
