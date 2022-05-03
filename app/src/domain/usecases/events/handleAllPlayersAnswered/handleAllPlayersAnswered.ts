import { AllPlayersAnsweredEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const handleAllPlayersAnswered = createThunk(({ dispatch }, event: AllPlayersAnsweredEvent) => {
  dispatch(
    gameActions.updateGame({
      answers: event.answers,
    }),
  );

  dispatch(navigateToGameRoute('/started/winner-selection'));
});
