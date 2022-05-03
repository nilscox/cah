import expect from 'expect';

import { TestBuilder } from '../../../../tests/TestBuilder';
import { TestStore } from '../../../../tests/TestStore';

import { closeMenu, navigate, navigateToGameRoute, openMenu } from './navigate';

describe('navigate', () => {
  const store = new TestStore();

  it('navigates to another route', () => {
    store.dispatch(navigate('/lunettes'));

    expect(store.routerGateway.pathname).toEqual('/lunettes');
    expect(store.routerGateway.gamePathname).toEqual('/');
  });

  it('navigates to a game route', () => {
    store.dispatch(TestBuilder.setPlayer());
    store.dispatch(TestBuilder.createGame({ code: 'cafe' }));

    store.dispatch(navigateToGameRoute('/moustache'));

    expect(store.routerGateway.pathname).toEqual('/game/cafe');
    expect(store.routerGateway.gamePathname).toEqual('/game/cafe/moustache');
    expect(store.routerGateway.gameLocationState).toBeUndefined();

    store.dispatch(navigateToGameRoute('/', { answer: 42 }));

    expect(store.routerGateway.gameLocationState).toEqual({ answer: 42 });
  });

  it('toggles the game menu', () => {
    store.dispatch(TestBuilder.setPlayer());
    store.dispatch(TestBuilder.createGame({ code: 'cafe' }));

    store.dispatch(openMenu());

    expect(store.routerGateway.pathname).toEqual('/game/cafe/menu');
    expect(store.routerGateway.gamePathname).toEqual('/game/cafe/menu');

    store.dispatch(closeMenu());

    expect(store.routerGateway.pathname).toEqual('/game/cafe');
    expect(store.routerGateway.gamePathname).toEqual('/game/cafe/idle');
  });
});
