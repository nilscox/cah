import { GameState } from '@cah/shared';
import { assert } from '@cah/utils';
import { createSelector } from '@reduxjs/toolkit';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { answersSelectors } from '../answers/answers.selectors';
import { questionsSelectors } from '../questions/questions.selectors';

import { GameSlice } from './game.slice';

const game = (state: AppState) => defined(state.game);
const hasGame = (state: AppState) => state.game !== null;

const code = createSelector(game, (game) => {
  return game.code;
});

type StartedGameSlice = GameSlice & {
  questionMasterId: string;
  questionId: string;
  answersIds: string[];
  isAnswerValidated: boolean;
};

const startedGame = createSelector(game, (game) => {
  assert(game.state !== GameState.started);
  return game as StartedGameSlice;
});

const isQuestionMaster = createSelector(
  startedGame,
  (state: AppState, playerId: string) => playerId,
  (game, playerId) => playerId === game.questionMasterId,
);

const currentQuestion = createSelector(startedGame, questionsSelectors.questions, (game, questions) => {
  return defined(questions[game.questionId]);
});

const answers = createSelector(startedGame, answersSelectors.answers, (game, answers) => {
  return game.answersIds.map((answerId) => defined(answers[answerId]));
});

export const gameSelectors = {
  game,
  hasGame,
  code,
  startedGame,
  isQuestionMaster,
  currentQuestion,
  answers,
};
