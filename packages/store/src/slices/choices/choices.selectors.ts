import { pipe } from '@nilscox/selektor';

import { defined } from '../../defined';
import { AppState } from '../../types';

import { choicesAdapter } from './choices.slice';

export const {
  selectAll: selectAllChoices,
  selectById: selectChoiceById,
  selectEntities: selectChoices,
} = choicesAdapter.getSelectors<AppState>((state) => state.choices);

export const selectChoicesByIds = pipe(selectChoices, (choices, ids: string[]) => {
  return ids.map((id) => defined(choices[id]));
});
