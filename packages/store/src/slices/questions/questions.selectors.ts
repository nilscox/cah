import { createSelector } from 'reselect';

import { AppState } from '../../types';

import { questionsAdapter } from './questions.slice';

const { selectAll: all, selectById: byId } = questionsAdapter.getSelectors(
  (state: AppState) => state.questions,
);

const expectedNumberOfChoices = createSelector(byId, (question) => {
  assert(question);
  return question.blanks?.length ?? 1;
});

export const questionsSelectors = {
  all,
  byId,
  expectedNumberOfChoices,
};
