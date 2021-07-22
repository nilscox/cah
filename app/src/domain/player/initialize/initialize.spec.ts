import expect from 'expect';

import { ServerStatus } from '../../../store/reducers/appStateReducer';
import { AppStore } from '../../../store/types';
import { expectPartialState, expectState, inMemoryStore } from '../../../store/utils';
import { createPlayer } from '../../../utils/factories';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../../gateways/InMemoryRouterGateway';

import { initialize } from './initialize';

describe('initialize', () => {
  let playerGateway: InMemoryPlayerGateway;
  let routerGateway: InMemoryRouterGateway;

  let store: AppStore;

  beforeEach(() => {
    playerGateway = new InMemoryPlayerGateway();
    routerGateway = new InMemoryRouterGateway();

    store = inMemoryStore({ playerGateway, routerGateway });
  });

  it('fetches the player currently logged in', async () => {
    await store.dispatch(initialize());

    expectPartialState(store, 'player', {});
    expectState(store, 'app', { server: ServerStatus.up, ready: true });
  });

  it('redirects to the login page', async () => {
    await store.dispatch(initialize());

    expect(routerGateway.pathname).toEqual('/login');
  });

  it('redirects to the home page when authenticated', async () => {
    playerGateway.player = createPlayer();
    routerGateway.push('/login');

    await store.dispatch(initialize());

    expect(routerGateway.pathname).toEqual('/');
  });

  it('redirects to the home page when not in a game', async () => {
    playerGateway.player = createPlayer();
    routerGateway.push('/game/OK42');

    await store.dispatch(initialize());

    expect(routerGateway.pathname).toEqual('/');
  });
});
