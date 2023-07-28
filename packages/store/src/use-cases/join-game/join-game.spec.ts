import { GameState } from '@cah/shared';

import { AppStore, createStore } from '../../index';
import { MockClient } from '../../mock-client';
import { GameSlice, gameSelectors } from '../../slices/game.slice';
import { playerActions, playerSelectors } from '../../slices/player.slice';

import { joinGame } from './join-game';

describe('joinGame', () => {
  let client: MockClient;
  let store: AppStore;

  beforeEach(() => {
    client = new MockClient();
    store = createStore({ client });

    store.dispatch(playerActions.setPlayer({ id: 'playerId', nick: '' }));

    client.joinGame.mockResolvedValue('gameId');

    client.getGame.mockResolvedValue({
      id: 'gameId',
      state: GameState.idle,
      code: '42SH',
      players: [],
    });
  });

  it('joins an existing game game', async () => {
    await store.dispatch(joinGame('42SH'));

    expect(gameSelectors.game(store.getState())).toEqual<GameSlice>({
      id: 'gameId',
      code: '42SH',
      state: GameState.idle,
      players: [],
    });
  });

  it("sets the player's gameId", async () => {
    await store.dispatch(joinGame('42SH'));

    expect(playerSelectors.player(store.getState())).toHaveProperty('gameId', 'gameId');
  });
});
