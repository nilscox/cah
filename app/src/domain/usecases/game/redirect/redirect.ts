import { PlayState } from '../../../../../../shared/enums';
import { createThunk } from '../../../../store/createThunk';
import { selectMenuOpen } from '../../../../store/selectors/appStateSelectors';
import { Game, isStarted } from '../../../entities/Game';

const push = createThunk(({ gameRouterGateway, routerGateway }, pathname: string) => {
  routerGateway.push(pathname);
  gameRouterGateway.push(pathname);
});

const playStateMap = {
  [PlayState.playersAnswer]: 'players-answer',
  [PlayState.questionMasterSelection]: 'question-master-selection',
  [PlayState.endOfTurn]: 'end-of-turn',
};

export const redirect = createThunk(({ getState, dispatch, gameRouterGateway }) => {
  const player = getState().player;
  const game = getState().game as Game;
  const menuOpen = selectMenuOpen(getState());

  if (!player) {
    return dispatch(push('/login'));
  }

  if (!game) {
    return dispatch(push('/'));
  }

  if (menuOpen) {
    return dispatch(push(`/game/${game.code}/menu`));
  }

  dispatch(push(`/game/${game.code}/${game.state}`));

  if (isStarted(game)) {
    gameRouterGateway.push(`/game/${game.code}/${game.state}/${playStateMap[game.playState]}`);
  }
});
