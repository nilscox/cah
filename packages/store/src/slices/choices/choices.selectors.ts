import { AppState } from '../../types';

import { choicesAdapter } from './choices.slice';

export const {
  selectAll: selectAllChoices,
  selectById: selectChoiceById,
  selectEntities: selectChoices,
} = choicesAdapter.getSelectors<AppState>((state) => state.choices);
