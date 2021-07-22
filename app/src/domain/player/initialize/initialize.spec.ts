import expect from 'expect';

import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { InMemoryStore } from '../../../store/utils';
import { createPlayer } from '../../../utils/factories';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../../gateways/InMemoryRouterGateway';

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

  it('redirects to the login page', async () => {
    await store.dispatch(initialize());

    expect(routerGateway.pathname).toEqual('/login');
  });

  it('redirects to the home page when authenticated', async () => {
    playerGateway.player = createPlayer();
    routerGateway.push('/login');
    store.snapshot();

    await store.dispatch(initialize());

    expect(routerGateway.pathname).toEqual('/');
  });

  it('redirects to the home page when not in a game', async () => {
    playerGateway.player = createPlayer();
    routerGateway.push('/game/OK42');
    store.snapshot();

    await store.dispatch(initialize());

    expect(routerGateway.pathname).toEqual('/');
  });
});
