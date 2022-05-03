import expect from 'expect';

import { GameStartedEvent } from '../../../../../../shared/events';
import { selectGame } from '../../../../store/slices/game/game.selectors';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { GameState } from '../../../entities/game';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleGameStarted', () => {
  const store = new TestBuilder().apply(TestBuilder.setPlayer()).apply(TestBuilder.createGame()).getStore();

  const message: GameStartedEvent = {
    type: 'GameStarted',
    totalQuestions: 2,
  };

  it('sets the game in started state', () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectGame)).toHaveProperty('state', GameState.started);
    expect(store.select(selectGame)).toHaveProperty('totalQuestions', 2);
  });

  it('shows a notification', () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.app.notification).toEqual('The game has started');
  });
});
