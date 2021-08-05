import expect from 'expect';

import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { createFullPlayer, createGame, createTurns } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';

import { initialize } from './initialize';

describe('initialize', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('initializes with no player logged in', async () => {
    await store.dispatch(initialize());

    store.expectState('player', null);

    store.expectState('app', {
      network: NetworkStatus.up,
      server: NetworkStatus.up,
      ready: true,
      menuOpen: false,
    });
  });

  it('initializes with a player who is not in game', async () => {
    const player = createFullPlayer();

    store.playerGateway.player = player;

    await store.dispatch(initialize());

    expect(store.getState().player).toHaveProperty('id', player.id);
  });

  it('initializes with a player who is in game', async () => {
    const game = createGame();
    const turns = createTurns(2);
    const player = createFullPlayer({ gameId: game.id });

    store.playerGateway.player = player;
    store.gameGateway.game = game;
    store.gameGateway.turns = turns;

    await store.dispatch(initialize());

    expect(store.getState().game).toHaveProperty('id', game.id);
    expect(store.getState().game).toHaveProperty('turns', turns);
  });

  it('reacts to network status update events', async () => {
    const { networkGateway } = store;

    networkGateway.networkStatus = NetworkStatus.down;

    await store.dispatch(initialize());
    store.snapshot();

    store.expectPartialState('app', {
      network: NetworkStatus.down,
    });

    networkGateway.triggerNetworkStatusChange(NetworkStatus.up);

    store.expectPartialState('app', {
      network: NetworkStatus.up,
    });

    networkGateway.triggerNetworkStatusChange(NetworkStatus.down);

    store.expectPartialState('app', {
      network: NetworkStatus.down,
    });
  });
});
