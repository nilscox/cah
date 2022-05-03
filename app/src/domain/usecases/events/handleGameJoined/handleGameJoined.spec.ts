import expect from 'expect';

import { PlayerDto } from '../../../../../../shared/dtos';
import { selectPlayers } from '../../../../store/slices/game/game.selectors';
import { createId } from '../../../../tests/create-id';
import { createPlayer } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleGameJoined', () => {
  const player = createPlayer();

  const newPlayer: PlayerDto = {
    id: createId(),
    isConnected: false,
    nick: 'new player',
  };

  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer(player))
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .getStore();

  it('adds the new player to the game', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'GameJoined',
        player: newPlayer,
      }),
    );

    expect(store.select(selectPlayers)).toContainEqual({
      id: newPlayer.id,
      isConnected: false,
      nick: 'new player',
    });
  });

  it('shows a notification', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'GameJoined',
        player: newPlayer,
      }),
    );

    expect(store.app.notification).toEqual('new player a rejoint la partie');
  });

  it('does not show a notification when the player himself joins a game', () => {
    store.dispatch(
      handleRTCMessage({
        type: 'GameJoined',
        player: newPlayer,
      }),
    );

    expect(store.app.notification).toBeUndefined();
  });
});
