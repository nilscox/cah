import {
  AnswerViewModel,
  endTurn,
  selectAnswer,
  selectCanEndTurn,
  selectCanSelectAnswer,
  selectCurrentQuestionChunks,
  selectGameAnswers,
  selectIsWinner,
  selectPlayerById,
} from '@cah/store';
import { For, Show } from 'solid-js';

import { selector } from '../utils/selector';

import { QuestionCard } from './question-card';

export function AnswersList() {
  const answers = selector(selectGameAnswers);
  const canSelectAnswer = selector(selectCanSelectAnswer);
  const canEndTurn = selector(selectCanEndTurn);

  const handleSubmitAnswer = (answerId: string) => {
    void store.dispatch(selectAnswer(answerId));
  };

  const handleNextTurn = () => {
    void store.dispatch(endTurn());
  };

  return (
    <div class="col gap-6 p-4">
      <For each={answers()}>
        {(answer) => (
          <Answer answer={answer} onClick={() => canSelectAnswer() && handleSubmitAnswer(answer.id)} />
        )}
      </For>

      <Show when={canEndTurn()}>
        <button onClick={handleNextTurn}>Next</button>
      </Show>
    </div>
  );
}

type AnswerProps = {
  answer: AnswerViewModel;
  onClick: () => void;
};

function Answer(props: AnswerProps) {
  const player = selector((state) =>
    props.answer.playerId ? selectPlayerById(state, props.answer.playerId) : undefined,
  );

  const chunks = selector((state) => selectCurrentQuestionChunks(state, props.answer.choices));
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
