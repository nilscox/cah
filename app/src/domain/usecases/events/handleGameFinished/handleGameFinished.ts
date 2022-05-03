import { GameFinishedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { GameState } from '../../../entities/game';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const handleGameFinished = createThunk(({ dispatch }, _event: GameFinishedEvent) => {
  dispatch(
    gameActions.updateGame({
      state: GameState.finished,
      playState: undefined,
      answers: undefined,
      questionMaster: undefined,
      question: undefined,
    }),
  );

  dispatch(navigateToGameRoute('/finished'));
});
