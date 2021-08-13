import expect from 'expect';

import { createChoices, createFullPlayer, createGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
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

  const expectGameRoute = (route: string, state?: Record<string, unknown>) => {
    expect(store.routerGateway.gamePathname).toEqual(`/game/code${route}`);
    expect(store.routerGateway.gameLocationState).toEqual(state);
  };

  it('gives some new cards to the player', () => {
    const [existingCard, ...newCards] = createChoices(3);

    store.setup(({ dispatch }) => {
      dispatch(setPlayer(createFullPlayer({ cards: [existingCard] })));
      dispatch(setGame(createGame()));
    });

    triggerRTCMessage({
      type: 'CardsDealt',
      cards: newCards,
    });

    store.expectPartialState('player', {
      cards: [existingCard, ...newCards],
    });
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

  it('navigates to the game finished view when game... finishes', () => {
    store.dispatch(setGame(createGame()));

    triggerRTCMessage({ type: 'GameFinished' });

    expectGameRoute('/finished', { animations: true });
  });
});
