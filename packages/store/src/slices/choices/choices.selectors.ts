import { createSelector } from 'reselect';

import { defined } from '../../defined';
import { AppState } from '../../types';

import { choicesAdapter } from './choices.slice';

const { selectAll: all, selectById: byId } = choicesAdapter.getSelectors((state: AppState) => state.choices);

const byIds = createSelector([(state: AppState) => state, (state, ids: string[]) => ids], (state, ids) => {
  return ids.map((id) => defined(byId(state, id)));
});

export const choicesSelectors = {
  all,
  byIds,
};
