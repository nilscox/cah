import { TurnFinishedEvent } from '../../../../../../shared/events';
import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { selectAnswers, selectQuestion, selectTurns, selectWinner } from '../../../../store/slices/game/game.selectors';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { Answer } from '../../../entities/Answer';
import { GamePlayer } from '../../../entities/game';

export const handleTurnFinished = createThunk(({ dispatch, getState }, _event: TurnFinishedEvent) => {
  const question = selectQuestion(getState());
  const answers = selectAnswers(getState()) as Answer[];
  const winner = selectWinner(getState()) as GamePlayer;
  const turns = selectTurns(getState());

  dispatch(
    gameActions.updateGame({
      answers: [],
      winner: undefined,
    }),
  );

  dispatch(
    gameActions.addTurn({
      number: turns.length + 1,
      question,
      answers,
      winner,
    }),
  );

  dispatch(playerActions.setSelectionValidated(false));
});
