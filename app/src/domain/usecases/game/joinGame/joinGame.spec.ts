import expect from 'expect';

import { createFullPlayer, createGame, createPlayer } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';
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
      creator: game.creator,
      code: 'OK42',
      state: GameState.idle,
      players: [],
      turns: [],
    });
  });

  it('does not display a notification when player himself joins', async () => {
    const player = createFullPlayer();

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(player));
      dispatch(setGame(createGame()));
      listenRTCMessages();
    });

    store.rtcGateway.triggerMessage({ type: 'GameJoined', player });

    store.expectPartialState('app', { notification: undefined });
  });

  it('another player joins a game', async () => {
    const game = createGame({ code: 'OK22' });
    const player = createPlayer({ nick: 'mario', isConnected: true });

    store.setup(({ dispatch, listenRTCMessages }) => {
      dispatch(setPlayer(createFullPlayer()));
      dispatch(setGame(game));
      listenRTCMessages();
    });

    store.rtcGateway.triggerMessage({ type: 'GameJoined', player });

    store.expectPartialState('game', {
      players: [player],
    });

    store.expectPartialState('app', { notification: 'mario a rejoint la partie' });
  });

  it('redirects to the game view', async () => {
    await store.dispatch(joinGame('OK44'));

    expect(store.routerGateway.gamePathname).toEqual('/game/OK44/idle');
  });
});
