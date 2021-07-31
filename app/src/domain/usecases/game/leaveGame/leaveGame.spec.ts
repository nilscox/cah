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

  it('redirects to the lobby view', async () => {
    const player = createPlayer();

    store.dispatch(setGame(createGame({ code: 'OK42', players: [player] })));

    await store.dispatch(leaveGame());

    expect(store.routerGateway.pathname).toEqual('/');
  });
});