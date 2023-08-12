import { Choice } from '@cah/shared';

import { selectedSelectedChoices } from '../../slices/player/player.selectors';
import { playerActions } from '../../slices/player/player.slice';
import { AppThunk } from '../../types';

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
