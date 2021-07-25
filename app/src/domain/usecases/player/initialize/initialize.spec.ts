import expect from 'expect';

import { ServerStatus } from '../../../../store/reducers/appStateReducer';
import { createFullPlayer } from '../../../../tests/factories';
import { InMemoryPlayerGateway } from '../../../../tests/gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../../../../tests/gateways/InMemoryRouterGateway';
import { InMemoryStore } from '../../../../tests/InMemoryStore';

import { initialize } from './initialize';

describe('initialize', () => {
  let store: InMemoryStore;

  let routerGateway: InMemoryRouterGateway;
  let playerGateway: InMemoryPlayerGateway;

  beforeEach(() => {
    store = new InMemoryStore();
    ({ routerGateway, playerGateway } = store);
  });

  it('initializes with no player logged in', async () => {
    await store.dispatch(initialize());

    store.expectState('player', null);
    store.expectState('app', { server: ServerStatus.up, ready: true });
  });

  describe('redirections', () => {
    const expectRedirections = async (expected: string) => {
      for (const before of ['/', '/login', '/game', '/elsewhere']) {
        routerGateway.push(before);

        await store.dispatch(initialize());

        expect(routerGateway.pathname).toEqual(expected);
      }
    };

    it('no player => login view', async () => {
      await expectRedirections('/login');
    });

    it('player, no game => lobby view', async () => {
      playerGateway.player = createFullPlayer();
      await expectRedirections('/');
    });

    it('player, game => game view', async () => {
      playerGateway.player = createFullPlayer({ gameId: 'gameId' });
      await expectRedirections('/game/OK42');
    });
  });
});
