import { hasId } from '../../../../shared/has-id';
import { isNotNull } from '../../../../shared/is-not-null';
import { last } from '../../../../shared/last';
import { createThunk } from '../../../../store/createThunk';
import { playerActions } from '../../../../store/slices/player/player.actions';
import {
  selectPlayerChoicesSelection,
  selectPlayerSelectionFirstBlankIndex,
} from '../../../../store/slices/player/player.selectors';
import { Choice } from '../../../entities/Choice';

export const toggleChoice = createThunk(({ dispatch, getState }, choice: Choice) => {
  const selection = selectPlayerChoicesSelection(getState());
  const isSelected = selection.filter(isNotNull).some(hasId(choice.id));

  if (isSelected) {
    dispatch(playerActions.unselectChoice(choice));
  } else {
    let firstBlankIndex = selectPlayerSelectionFirstBlankIndex(getState());

    if (firstBlankIndex < 0) {
      dispatch(playerActions.unselectChoice(last(selection) as Choice));
      firstBlankIndex = selectPlayerSelectionFirstBlankIndex(getState());
    }

    dispatch(playerActions.selectChoice(choice, firstBlankIndex));
  }
});
