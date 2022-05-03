import { PlayState } from '../../../../../../shared/enums';
import { createThunk } from '../../../../store/createThunk';
import { selectGameUnsafe } from '../../../../store/slices/game/game.selectors';
import { isGameStarted } from '../../../entities/game';
import { selectPlayerUnsafe } from '../../../selectors/playerSelectors';
import { navigate, navigateToGameRoute } from '../../app/navigate/navigate';

const playStateMap = {
  [PlayState.playersAnswer]: 'answer-question',
  [PlayState.questionMasterSelection]: 'winner-selection',
  [PlayState.endOfTurn]: 'end-of-turn',
};

export const redirect = createThunk(({ getState, dispatch }) => {
  const player = selectPlayerUnsafe(getState());
  const game = selectGameUnsafe(getState());

  if (!player.id) {
    return dispatch(navigate('/login'));
  }

  if (!game) {
    return dispatch(navigate('/'));
  }

  if (isGameStarted(game)) {
    dispatch(navigateToGameRoute(`/${game.state}/${playStateMap[game.playState]}`));
  } else {
    dispatch(navigateToGameRoute(`/${game.state}`));
  }
});
