import { type Choice } from '@cah/shared';

import { selectedSelectedChoices } from '../../slices/player/player.selectors.ts';
import { playerActions } from '../../slices/player/player.slice.ts';
import { type AppThunk } from '../../types.ts';

export const toggleChoice = (choice: Choice): AppThunk<void> => {
  return (dispatch, getState) => {
    const selected = selectedSelectedChoices(getState());
    const index = selected.indexOf(choice);

    if (index >= 0) {
      dispatch(playerActions.clearSelectedChoice(index));
    } else {
      const firstNullIndex = selected.indexOf(null);

      if (firstNullIndex >= 0) {
        dispatch(playerActions.setSelectedChoice([choice.id, firstNullIndex]));
      } else {
        dispatch(playerActions.setSelectedChoice([choice.id, selected.length - 1]));
      }
    }
  };
};
