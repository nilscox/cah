import expect from 'expect';

import { createFullPlayer, createGame } from '../../../../tests/factories';
import { InMemoryStore } from '../../../../tests/InMemoryStore';
import { setGame, setPlayer } from '../../../actions';

import { closeMenu, navigate, navigateToGameRoute, openMenu } from './navigate';

describe('navigate', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('navigates to another route', () => {
    store.dispatch(navigate('/lunettes'));

    expect(store.routerGateway.pathname).toEqual('/lunettes');
    expect(store.routerGateway.gamePathname).toEqual('/');
  });

  it('navigates to a game route', () => {
    store.dispatch(setPlayer(createFullPlayer()));
    store.dispatch(setGame(createGame({ code: 'cafe' })));

    store.dispatch(navigateToGameRoute('/moustache'));

    expect(store.routerGateway.pathname).toEqual('/game/cafe');
    expect(store.routerGateway.gamePathname).toEqual('/game/cafe/moustache');
    expect(store.routerGateway.gameLocationState).toBeUndefined();

    store.dispatch(navigateToGameRoute('/', { answer: 42 }));

    expect(store.routerGateway.gameLocationState).toEqual({ answer: 42 });
  });

  it('toggles the game menu', () => {
    store.dispatch(setPlayer(createFullPlayer()));
    store.dispatch(setGame(createGame({ code: 'cafe' })));

    store.dispatch(openMenu());

    expect(store.routerGateway.pathname).toEqual('/game/cafe/menu');
    expect(store.routerGateway.gamePathname).toEqual('/game/cafe/menu');

    store.dispatch(closeMenu());

    expect(store.routerGateway.pathname).toEqual('/game/cafe');
    expect(store.routerGateway.gamePathname).toEqual('/game/cafe/idle');
  });
});
