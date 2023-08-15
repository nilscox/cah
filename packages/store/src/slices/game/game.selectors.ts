import { GameState } from '@cah/shared';
import { assert } from '@cah/utils';
import { combine, createSelector, pipe } from '@nilscox/selektor';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { selectAnswers } from '../answers/answers.selectors';
import { selectQuestions } from '../questions/questions.selectors';

import { GameSlice, PlayState } from './game.slice';

export const selectGameUnsafe = createSelector((state: AppState) => state.game);

export const selectHasGame = pipe(selectGameUnsafe, (game) => game !== null);
export const selectGame = pipe(selectGameUnsafe, (game) => defined(game));

export const selectGameCode = pipe(selectGame, (game) => game.code);

type StartedGameSlice = GameSlice & {
  questionMasterId: string;
  questionId: string;
  answersIds: string[];
  // todo: rename to isAnswerSelected
  isAnswerValidated: boolean;
};

export const selectStartedGame = pipe(selectGame, (game) => {
  assert(game.state !== GameState.started);
  return game as StartedGameSlice;
});

export const selectCurrentQuestion = combine(selectStartedGame, selectQuestions, (game, questions) => {
  return defined(questions[game.questionId]);
});

export const selectGameAnswers = combine(selectStartedGame, selectAnswers, (game, answers) => {
  return game.answersIds.map((answerId) => defined(answers[answerId]));
});

export const selectedIsAnswerSelected = combine(selectStartedGame, (game) => {
  return game.isAnswerValidated;
});

export const selectedWinnerId = combine(selectStartedGame, selectAnswers, (game, answers) => {
  if (!game.selectedAnswerId) {
    return undefined;
  }

  return defined(answers[game.selectedAnswerId]?.playerId);
});

export const selectIsWinner = pipe(selectedWinnerId, (winnerId, playerId: string) => {
  return winnerId === playerId;
});

export const selectPlayState = pipe(selectGameAnswers, (answers) => {
  if (answers.length === 0) {
    return PlayState.playersAnswer;
  }

  if (answers.some((answer) => !answer.playerId)) {
    return PlayState.questionMasterSelection;
  }

  return PlayState.endOfTurn;
});
