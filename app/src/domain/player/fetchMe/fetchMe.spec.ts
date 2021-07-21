import expect from 'expect';

import { AppStore } from '../../../store/types';
import { expectPartialState, expectState, inMemoryStore } from '../../../store/utils';
import { createPlayer } from '../../../utils/factories';
import { InMemoryPlayerGateway } from '../../gateways/InMemoryPlayerGateway';
import { InMemoryRouterGateway } from '../../gateways/InMemoryRouterGateway';

import { fetchMe } from './fetchMe';

describe('fetchMe', () => {
  let playerGateway: InMemoryPlayerGateway;
  let routerGateway: InMemoryRouterGateway;

  let store: AppStore;

  beforeEach(() => {
    playerGateway = new InMemoryPlayerGateway();
    routerGateway = new InMemoryRouterGateway();

    store = inMemoryStore({ playerGateway, routerGateway });
  });

  it('fetches the player currently logged in', async () => {
    await store.dispatch(fetchMe());

    expectPartialState(store, 'player', {});
    expectState(store, 'app', { ready: true });
  });

  it('redirects to the login page', async () => {
    await store.dispatch(fetchMe());

    expect(routerGateway.pathname).toEqual('/login');
  });

  it('redirects to the home page when authenticated', async () => {
    playerGateway.player = createPlayer();
    routerGateway.push('/login');

    await store.dispatch(fetchMe());

    expect(routerGateway.pathname).toEqual('/');
  });

  it('redirects to the home page when not in a game', async () => {
    playerGateway.player = createPlayer();
    routerGateway.push('/game/OK42');

    await store.dispatch(fetchMe());

    expect(routerGateway.pathname).toEqual('/');
  });
});
