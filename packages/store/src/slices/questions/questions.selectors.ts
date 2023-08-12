import { assert } from '@cah/utils';
import { pipe } from '@nilscox/selektor';

import { AppState } from '../../types';

import { questionsAdapter } from './questions.slice';

export const {
  selectEntities: selectQuestions,
  selectAll: selectAllQuestions,
  selectById: selectQuestionById,
} = questionsAdapter.getSelectors((state: AppState) => state.questions);

export const selectExpectedNumberOfChoices = pipe(selectQuestionById, (question) => {
  assert(question);
  return question.blanks?.length ?? 1;
});
