import { createThunk } from '../../../../store/createThunk';
import { selectCurrentQuestion } from '../../../../store/selectors/gameSelectors';
import { selectChoicesSelection } from '../../../../store/selectors/playerSelectors';
import { choiceSelected, choiceUnselected } from '../../../actions';
import { Choice } from '../../../entities/Choice';

export const toggleChoice = createThunk(({ dispatch, getState }, choice: Choice) => {
  const state = getState();
  const question = selectCurrentQuestion(state);

  const selection = selectChoicesSelection(state);
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
