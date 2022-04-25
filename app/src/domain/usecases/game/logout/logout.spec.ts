import { expect } from 'earljs';

import { selectGameUnsafe } from '../../../../store/selectors/gameSelectors';
import { selectPlayerUnsafe } from '../../../../store/selectors/playerSelectors';
import { createFullPlayer, createGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';

import { logout } from './logout';

describe('logout', () => {
  let store = new InMemoryStore();

  beforeEach(() => {
    store = new InMemoryStore();
  });

  const player = createFullPlayer();
  const game = createGame();

  beforeEach(() => {
    store.setup(({ dispatch }) => {
      dispatch(setPlayer(player));
      dispatch(setGame(game));
      store.playerGateway.player = player;
    });
  });

  it('logs out', async () => {
    await store.dispatch(logout());

    expect(selectPlayerUnsafe(store.getState())).toEqual(null);
    expect(selectGameUnsafe(store.getState())).toEqual(null);
    expect(store.playerGateway.player).toEqual(undefined);
  });

  it('redirects to the /login view', async () => {
    await store.dispatch(logout());

    expect(store.routerGateway.pathname).toEqual('/login');
  });
});
