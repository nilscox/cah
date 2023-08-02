import { createSelector } from 'reselect';

import { defined } from '../../defined';
import { AppState } from '../../types';

import { answersAdapter } from './answers.slice';

const {
  selectEntities: answers,
  selectAll: all,
  selectById: byId,
} = answersAdapter.getSelectors((state: AppState) => state.answers);

const byIds = createSelector([(state: AppState) => state, (state, ids: string[]) => ids], (state, ids) => {
  return ids.map((id) => defined(byId(state, id)));
});

export const answersSelectors = {
  answers,
  byId,
  all,
  byIds,
};
