import { type AppState } from '../../types.ts';

import { choicesAdapter } from './choices.slice.ts';

export const {
  selectAll: selectAllChoices,
  selectById: selectChoiceById,
  selectEntities: selectChoices,
} = choicesAdapter.getSelectors<AppState>((state) => state.choices);
