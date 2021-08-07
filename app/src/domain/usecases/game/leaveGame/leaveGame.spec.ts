import expect from 'expect';

import { createGame, createPlayer } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame } from '../../../actions';

import { leaveGame } from './leaveGame';

describe('leaveGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('leaves a game', async () => {
    const player = createPlayer();

    store.dispatch(setGame(createGame({ code: 'OK42', players: [player] })));

    await store.dispatch(leaveGame());

    store.expectState('game', null);
  });

  it('another player leaves the game', async () => {
    const player = createPlayer({ nick: 'Toto' });

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setGame(createGame({ code: 'OK42', players: [player] })));
      listenRTCMessages();
    });

    await store.rtcGateway.triggerMessage({ type: 'GameLeft', player: 'Toto' });

    store.expectPartialState('game', { players: [] });
    store.expectPartialState('app', { notification: 'Toto a quitté la partie' });
  });

  it('redirects to the lobby view', async () => {
    const player = createPlayer();

    store.dispatch(setGame(createGame({ code: 'OK42', players: [player] })));

    await store.dispatch(leaveGame());

    expect(store.routerGateway.pathname).toEqual('/');
  });
});
