import expect from 'expect';

import { selectAnswers } from '../../../../store/slices/game/game.selectors';
import { createAnonymousAnswers } from '../../../../tests/factories';
import { TestBuilder } from '../../../../tests/TestBuilder';
import { RTCMessage } from '../../../gateways/RTCGateway';
import { handleRTCMessage } from '../handleRTCMessage/handleRTCMessage';

describe('handleAllPlayersAnswered', () => {
  const store = new TestBuilder()
    .apply(TestBuilder.setPlayer())
    .apply(TestBuilder.createGame())
    .apply(TestBuilder.startGame())
    .getStore();

  const answers = createAnonymousAnswers(2);
  const message: RTCMessage = {
    type: 'AllPlayersAnswered',
    answers,
  };

  it('adds the anonymous answers to the game', () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.select(selectAnswers)).toEqual(answers);
  });

  it('redirects to the answer selection view', () => {
    store.dispatch(handleRTCMessage(message));

    expect(store.routerGateway.gamePathname).toMatch(/\/started\/winner-selection$/);
  });
});
