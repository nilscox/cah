import { AppState } from '../../types';

import { questionsAdapter } from './questions.slice';

const { selectAll: all, selectById: byId } = questionsAdapter.getSelectors(
  (state: AppState) => state.questions,
);

export const questionsSelectors = {
  all,
  byId,
};
