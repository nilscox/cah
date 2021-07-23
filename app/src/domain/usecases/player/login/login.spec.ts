import expect from 'expect';

import { InMemoryStore } from '../../../../tests/InMemoryStore';

import { login } from './login';

describe('login', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('logs in', async () => {
    await store.dispatch(login('Toto'));

    store.expectPartialState('player', {
      id: 'id',
      isConnected: true,
      nick: 'Toto',
    });
  });

  it('redirects to the home page', async () => {
    store.routerGateway.push('/login');

    await store.dispatch(login('Tata'));

    expect(store.routerGateway.pathname).toEqual('/');
  });
});
