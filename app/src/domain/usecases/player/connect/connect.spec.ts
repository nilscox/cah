import expect from 'expect';

import { createFullPlayer, createGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';

import { connect } from './connect';

describe('connect', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  beforeEach(() => {
    store.dispatch(setPlayer(createFullPlayer()));
    store.snapshot();
  });

  it('connects to the server', async () => {
    await store.dispatch(connect());

    store.expectPartialState('player', {
      isConnected: true,
    });
  });

  it('listens for an event and trigger the handleRTCMessage use case', async () => {
    store.dispatch(setGame(createGame({ code: '6699' })));

    await store.dispatch(connect());
    store.rtcGateway.triggerMessage({ type: 'AllPlayersAnswered', answers: [] });

    expect(store.routerGateway.pathname).toEqual('/game/6699');
  });
});
