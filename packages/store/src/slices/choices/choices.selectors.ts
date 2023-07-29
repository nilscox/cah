import { AppState } from '../../types';

import { choicesAdapter } from './choices.slice';

const { selectAll: all } = choicesAdapter.getSelectors((state: AppState) => state.choices);

export const choicesSelectors = {
  all,
};
