import { PlayState } from '../../../../../../shared/enums';
import { createThunk } from '../../../../store/createThunk';
import { Game, isStarted } from '../../../entities/Game';
import { navigate, navigateToGameRoute } from '../../app/navigate/navigate';

const playStateMap = {
  [PlayState.playersAnswer]: 'answer-question',
  [PlayState.questionMasterSelection]: 'winner-selection',
  [PlayState.endOfTurn]: 'end-of-turn',
};

export const redirect = createThunk(({ getState, dispatch }) => {
  const player = getState().player;
  const game = getState().game as Game;

  if (!player) {
    return dispatch(navigate('/login'));
  }

  if (!game) {
    return dispatch(navigate('/'));
  }

  if (isStarted(game)) {
    dispatch(navigateToGameRoute(`/${game.state}/${playStateMap[game.playState]}`));
  } else {
    dispatch(navigateToGameRoute(`/${game.state}`));
  }
});
