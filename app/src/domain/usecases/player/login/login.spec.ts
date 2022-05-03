import expect from 'expect';

import { FullPlayerDto } from '../../../../../../shared/dtos';
import { createId } from '../../../../tests/create-id';
import { TestStore } from '../../../../tests/TestStore';
import { selectPlayer } from '../../../selectors/playerSelectors';

import { login } from './login';

describe('login', () => {
  const store = new TestStore();

  const nick = 'Toto';
  const player: FullPlayerDto = {
    id: createId(),
    isConnected: false,
    nick,
    cards: [],
    hasFlushed: false,
  };

  beforeEach(() => {
    store.routerGateway.push('/login');
    store.playerGateway.login.mockResolvedValueOnce(player);
  });

  it('logs in', async () => {
    await store.dispatch(login(nick));

    expect(store.select(selectPlayer)).toEqual({
      id: player.id,
      nick,
      isConnected: true,
      game: null,
    });
  });

  it('redirects to the home page', async () => {
    await store.dispatch(login(nick));

    expect(store.routerGateway.pathname).toEqual('/');
  });
});
