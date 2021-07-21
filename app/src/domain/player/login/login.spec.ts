import expect from 'expect';

import { AppStore } from '../../../store/types';
import { expectPartialState, inMemoryStore } from '../../../store/utils';
import { InMemoryRouterGateway } from '../../gateways/InMemoryRouterGateway';

import { login } from './login';

describe('login', () => {
  let routerGateway: InMemoryRouterGateway;

  let store: AppStore;

  beforeEach(() => {
    routerGateway = new InMemoryRouterGateway();

    store = inMemoryStore({ routerGateway });
  });

  it('logs in', async () => {
    await store.dispatch(login('Toto'));

    expectPartialState(store, 'player', {
      nick: 'Toto',
    });
  });

  it('redirects to the home page', async () => {
    routerGateway.push('/login');

    await store.dispatch(login('Tata'));

    expect(routerGateway.pathname).toEqual('/');
  });
});
