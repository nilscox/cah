import {
  selectCanSubmitAnswer,
  selectCurrentQuestionChunks,
  selectPlayerCards,
  selectedSelectedChoices,
  submitAnswer,
  toggleChoice,
} from '@cah/store';

import { ChoicesList } from '../components/choices-list';
import { QuestionCard } from '../components/question-card';
import { selector } from '../selector';

export function PlayersAnswer() {
  const cards = selector(selectPlayerCards);
  const selectedChoices = selector(selectedSelectedChoices);
  const chunks = selector((state) => selectCurrentQuestionChunks(state, selectedChoices()));

  const canSubmitAnswer = selector(selectCanSubmitAnswer);

  const handleSubmitAnswer = () => {
    if (canSubmitAnswer()) {
      void store.dispatch(submitAnswer());
    }
  };

  return (
    <>
      <button onClick={handleSubmitAnswer} class="col min-h-[16rem] justify-center text-left">
        <QuestionCard class="p-4" chunks={chunks()} />
      </button>

      <ChoicesList
        choices={cards()}
        selectedChoices={selectedChoices()}
        onSelected={(choice) => store.dispatch(toggleChoice(choice))}
      />
    </>
  );
}
