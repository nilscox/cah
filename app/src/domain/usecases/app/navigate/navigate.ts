import { createThunk } from '../../../../store/createThunk';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import { redirect } from '../../game/redirect/redirect';

export const navigate = createThunk(({ routerGateway }, to: string) => {
  routerGateway.push(to);
});

export const navigateToGameRoute = createThunk(
  ({ getState, routerGateway }, to: string, state?: Record<string, unknown>) => {
    const game = selectGame(getState());

    routerGateway.pushGame(game, to, state);
  },
);

export const openMenu = createThunk(({ getState, routerGateway }) => {
  const game = selectGame(getState());

  routerGateway.pushGame(game, `/menu`);
  routerGateway.push(`/game/${game.code}/menu`);
});

export const closeMenu = createThunk(({ dispatch }) => {
  dispatch(redirect());
});
