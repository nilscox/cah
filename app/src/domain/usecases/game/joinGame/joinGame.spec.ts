import expect from 'expect';

import { createGame, createPlayer } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame } from '../../../actions';
import { GameState } from '../../../entities/Game';

import { joinGame } from './joinGame';

describe('joinGame', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('joins a game', async () => {
    const game = (store.gameGateway.game = createGame({ code: 'OK42' }));

    await store.dispatch(joinGame('OK42'));

    store.expectState('game', {
      id: game.id,
      code: 'OK42',
      state: GameState.idle,
      players: [],
      turns: [],
    });
  });

  it('another player joins a game', async () => {
    const game = createGame({ code: 'OK42' });
    const player = createPlayer({ nick: 'mario', isConnected: true });

    store.listenRTCMessages();
    await store.dispatch(setGame(game));
    store.snapshot();

    store.rtcGateway.triggerMessage({ type: 'GameJoined', player });

    store.expectPartialState('game', {
      players: [player],
    });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(joinGame('OK42'));

    expect(store.routerGateway.pathname).toEqual('/game/OK42');
  });
});
