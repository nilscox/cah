import expect from 'expect';

import { PlayState } from '../../../../../../shared/enums';
import { createGame, createQuestion } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame } from '../../../actions';
import { RTCMessage } from '../../../gateways/RTCGateway';

import { handleRTCMessage } from './handleRTCMessage';

describe('handleRTCMessage', () => {
  let store = new InMemoryStore();

  beforeEach(() => {
    store = new InMemoryStore();
  });

  const triggerRTCMessage = (message: RTCMessage) => {
    store.dispatch(handleRTCMessage(message));
  };

  const expectGameRoute = (route: string) => {
    expect(store.routerGateway.gamePathname).toEqual(`/game/code${route}`);
  };

  it('navigates to the answer question view when the turn starts', () => {
    store.dispatch(setGame(createGame()));

    triggerRTCMessage({
      type: 'TurnStarted',
      playState: PlayState.playersAnswer,
      question: createQuestion(),
      questionMaster: '',
    });

    expectGameRoute('/started/answer-question');
  });

  it('navigates to the winner selection view when all players answered', () => {
    store.dispatch(setGame(createGame()));

    triggerRTCMessage({ type: 'AllPlayersAnswered', answers: [] });

    expectGameRoute('/started/winner-selection');
  });

  it('navigates to the end of turn view when the winner was selected', () => {
    store.dispatch(setGame(createGame()));

    triggerRTCMessage({ type: 'WinnerSelected', answers: [], winner: '' });

    expectGameRoute('/started/end-of-turn');
  });
});
