import {
  AnswerSlice,
  endTurn,
  gameActions,
  selectCanEndTurn,
  selectCanSelectAnswer,
  selectChoicesByIds,
  selectCurrentQuestionChunks,
  selectGameAnswers,
  selectIsWinner,
  selectPlayerById,
  validateSelectedAnswer,
} from '@cah/store';
import { For, Show } from 'solid-js';

import { QuestionCard } from '../components/question-card';
import { selector } from '../selector';

export function AnswersList() {
  const answers = selector(selectGameAnswers);
  const canSelectAnswer = selector(selectCanSelectAnswer);
  const canEndTurn = selector(selectCanEndTurn);

  const handleSubmitAnswer = (answer: AnswerSlice) => {
    if (canSelectAnswer()) {
      store.dispatch(gameActions.setSelectedAnswer(answer.id));
      void store.dispatch(validateSelectedAnswer());
    }
  };

  const handleNextTurn = () => {
    void store.dispatch(endTurn());
  };

  return (
    <div class="col gap-6 p-4">
      <For each={answers()}>
        {(answer) => <Answer answer={answer} onClick={() => handleSubmitAnswer(answer)} />}
      </For>

      <Show when={canEndTurn()}>
        <button onClick={handleNextTurn}>Next</button>
      </Show>
    </div>
  );
}

type AnswerProps = {
  answer: AnswerSlice;
  onClick: () => void;
};

function Answer(props: AnswerProps) {
  const choices = selector((state) => selectChoicesByIds(state, props.answer.choicesIds));

  const player = selector((state) =>
    props.answer.playerId ? selectPlayerById(state, props.answer.playerId) : undefined,
  );

  const chunks = selector((state) => selectCurrentQuestionChunks(state, choices()));
  const isWinner = selector((state) => player()?.id && selectIsWinner(state, player()!.id));

  return (
    <div>
      <div class="mb-2">
        {player?.()?.nick ?? <>&nbsp;</>} {isWinner?.() && '*'}
      </div>

      <button class="text-left" onClick={() => props.onClick()}>
        <QuestionCard chunks={chunks()} />
      </button>
    </div>
  );
}
