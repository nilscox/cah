import { expect } from 'earljs';

import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { createChoices, createFullPlayer, createGame, createPlayer, createTurns } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { GameState } from '../../../entities/Game';

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
    });
  });

  it('initializes with a player who is not in game', async () => {
    const player = createFullPlayer({ nick: 'poooooopopopopo' });

    store.playerGateway.player = player;

    await store.dispatch(initialize());

    store.expectState('player', {
      id: player.id,
      nick: 'poooooopopopopo',
      isConnected: true,
      cards: [],
      selection: [],
      selectionValidated: false,
      hasFlushed: false,
    });
  });

  it('initializes with a player who is in game', async () => {
    const creator = createPlayer();
    const game = createGame({ creator });
    const turns = createTurns(2);
    const player = createFullPlayer({ gameId: game.id });

    store.playerGateway.player = player;
    store.gameGateway.game = game;
    store.gameGateway.turns = turns;

    await store.dispatch(initialize());

    store.expectState('game', {
      id: game.id,
      creator,
      code: 'code',
      players: [],
      state: GameState.idle,
      turns,
    });
  });

  it("persists the player's cards", async () => {
    const store = new InMemoryStore();
    const cards = createChoices(2);

    store.playerGateway.player = createFullPlayer({ cards });

    await store.dispatch(initialize());

    expect(store.persistenceGateway.getItem('cards')).toEqual(cards.map(({ id }) => id));
  });

  it('reacts to network status update events', async () => {
    const { networkGateway } = store;

    networkGateway.networkStatus = NetworkStatus.down;

    await store.dispatch(initialize());

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
