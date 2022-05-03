import expect from 'expect';

import { FullPlayerDto, GameDto } from '../../../../../../shared/dtos';
import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { createId } from '../../../../tests/create-id';
import { createChoices } from '../../../../tests/factories';
import { TestStore } from '../../../../tests/TestStore';
import { GameState } from '../../../entities/game';

import { initialize } from './initialize';

describe('initialize', () => {
  const store = new TestStore();

  it('initializes with no player logged in', async () => {
    await store.dispatch(initialize());

    expect(store.player).toEqual({
      id: '',
      isConnected: true,
      nick: '',
      game: null,
    });

    expect(store.app).toEqual({
      network: NetworkStatus.up,
      server: NetworkStatus.up,
      ready: true,
    });
  });

  const playerDto: FullPlayerDto = {
    id: createId(),
    isConnected: false,
    nick: 'nick',
    cards: [],
    hasFlushed: false,
  };

  it('initializes the app with a player who is not in game', async () => {
    store.playerGateway.fetchMe.mockResolvedValue(playerDto);

    await store.dispatch(initialize());

    expect(store.player).toEqual({
      id: playerDto.id,
      isConnected: true,
      nick: 'nick',
      game: null,
    });
  });

  const gameDto: GameDto = {
    id: createId(),
    code: 'ABCD',
    creator: 'creatorId',
    gameState: GameState.idle,
    players: [
      {
        id: 'creatorId',
        isConnected: false,
        nick: 'player 1',
      },
      {
        id: 'playerId',
        isConnected: true,
        nick: 'player 2',
      },
      {
        id: 'otherPlayerId',
        isConnected: false,
        nick: 'player 3',
      },
    ],
  };

  it('initializes the app with a player who is in game', async () => {
    store.playerGateway.fetchMe.mockResolvedValueOnce({
      ...playerDto,
      gameId: gameDto.id,
    });

    store.gameGateway.fetchGame.mockResolvedValueOnce(gameDto);
    store.gameGateway.fetchTurns.mockResolvedValueOnce([]);

    await store.dispatch(initialize());

    expect(store.game).toEqual({
      id: gameDto.id,
      creator: 'creatorId',
      code: 'ABCD',
      state: GameState.idle,
      players: {
        creatorId: gameDto.players[0],
        playerId: gameDto.players[1],
        otherPlayerId: gameDto.players[2],
      },
      turns: [],
    });
  });

  it("persists the player's cards", async () => {
    const cards = createChoices(2);

    store.playerGateway.fetchMe.mockResolvedValueOnce({
      ...playerDto,
      gameId: gameDto.id,
      cards,
    });

    store.gameGateway.fetchGame.mockResolvedValueOnce(gameDto);

    await store.dispatch(initialize());

    expect(store.persistenceGateway.getItem('cards')).toEqual(cards.map(({ id }) => id));
  });

  it('reacts to network status change events', async () => {
    const { networkGateway } = store;

    networkGateway.networkStatus = NetworkStatus.down;

    await store.dispatch(initialize());

    expect(store.app.network).toEqual(NetworkStatus.down);

    networkGateway.triggerNetworkStatusChange(NetworkStatus.up);

    expect(store.app.network).toEqual(NetworkStatus.up);
  });
});
