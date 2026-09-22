import { assert } from '@cah/utils';
import { pipe } from '@nilscox/selektor';

import { type AppState } from '../../types.ts';

import { questionsAdapter } from './questions.slice.ts';

export const {
  selectEntities: selectQuestions,
  selectAll: selectAllQuestions,
  selectById: selectQuestionById,
} = questionsAdapter.getSelectors((state: AppState) => state.questions);

export const selectExpectedNumberOfChoices = pipe(selectQuestionById, (question) => {
  assert(question);
  return question.blanks?.length ?? 1;
});
