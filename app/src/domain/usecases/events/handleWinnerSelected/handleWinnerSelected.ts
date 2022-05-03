import { WinnerSelectedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const handleWinnerSelected = createThunk(({ dispatch }, event: WinnerSelectedEvent) => {
  dispatch(
    gameActions.updateGame({
      answers: event.answers,
      winner: event.winner,
    }),
  );

  dispatch(navigateToGameRoute('/started/end-of-turn'));
});
