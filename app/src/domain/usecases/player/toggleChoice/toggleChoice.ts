import { currentQuestionSelector } from '../../../../infrastructure/client/hooks/useGame';
import { choicesSelectionSelector } from '../../../../infrastructure/client/hooks/usePlayer';
import { createThunk } from '../../../../store/createThunk';
import { choiceSelected, choiceUnselected } from '../../../actions';
import { Choice } from '../../../entities/Choice';

export const toggleChoice = createThunk(({ dispatch, getState }, choice: Choice) => {
  const state = getState();
  const question = currentQuestionSelector(state);

  const selection = choicesSelectionSelector(state);
  const selected = selection.some(({ id }) => id === choice.id);

  if (selected) {
    dispatch(choiceUnselected(choice));
  } else {
    if (selection.length === question.numberOfBlanks) {
      dispatch(choiceUnselected(selection[selection.length - 1] as Choice));
    }

    dispatch(choiceSelected(choice));
  }
});
