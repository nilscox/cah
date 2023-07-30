import { createSelector } from 'reselect';

import { defined } from '../../defined';
import { AppState } from '../../types';

import { answersAdapter } from './answers.slice';

const { selectById: byId } = answersAdapter.getSelectors((state: AppState) => state.answers);

const byIds = createSelector([(state: AppState) => state, (state, ids: string[]) => ids], (state, ids) => {
  return ids.map((id) => defined(byId(state, id)));
});

export const answersSelectors = {
  byId,
  byIds,
};
