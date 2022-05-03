import { TurnStartedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const handleTurnStarted = createThunk(({ dispatch }, event: TurnStartedEvent) => {
  dispatch(
    gameActions.updateGame({
      playState: event.playState,
      questionMaster: event.questionMaster,
      question: event.question,
    }),
  );

  dispatch(playerActions.resetSelection(event.question.numberOfBlanks));

  dispatch(navigateToGameRoute('/started/answer-question'));
});
