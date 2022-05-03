import expect from 'expect';

import { TestBuilder } from '../../../../tests/TestBuilder';
import { GameState } from '../../../entities/game';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleGameFinished', () => {
  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer())
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .apply(TestBuilder.answerQuestion())
    .apply(TestBuilder.selectWinner())
    .getStore();

  const message: RTCMessage = {
    type: 'GameFinished',
  };

  it('clears the game play state', () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.game).toMatchObject({
      state: GameState.finished,
      playState: undefined,
      answers: undefined,
      questionMaster: undefined,
      question: undefined,
    });
  });

  it('redirects to the game end view', () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.routerGateway.gamePathname).toMatch(/\/finished$/);
  });
});
