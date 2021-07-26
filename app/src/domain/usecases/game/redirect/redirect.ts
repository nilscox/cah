import { PlayState } from '../../../../../../shared/enums';
import { createThunk } from '../../../../store/createThunk';
import { Game, isStarted } from '../../../entities/Game';

const playStateMap = {
  [PlayState.playersAnswer]: 'players-answer',
  [PlayState.questionMasterSelection]: 'question-master-selection',
  [PlayState.endOfTurn]: 'end-of-turn',
};

export const redirect = createThunk(({ getState, routerGateway, gameRouterGateway }) => {
  const player = getState().player;
  const game = getState().game as Game;

  if (!player) {
    return routerGateway.push('/login');
  }

  if (!game) {
    return routerGateway.push('/');
  }

  routerGateway.push(`/game/${game.code}/${game.state}`);

  if (isStarted(game)) {
    gameRouterGateway.push(`/game/${game.code}/${game.state}/${playStateMap[game.playState]}`);
  }
});
