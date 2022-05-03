import { GameStartedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { GameState } from '../../../entities/game';
import { showNotification } from '../../app/showNotification/showNotification';

export const handleGameStarted = createThunk(({ dispatch }, event: GameStartedEvent) => {
  dispatch(
    gameActions.updateGame({
      state: GameState.started,
      totalQuestions: event.totalQuestions,
    }),
  );

  dispatch(showNotification('The game has started'));
});
