import {
  PlayState,
  selectCanSelectChoice,
  selectCanSubmitAnswer,
  selectCurrentQuestionChunks,
  selectIsQuestionMaster,
  selectPlayState,
  selectPlayerCards,
  selectedSelectedChoices,
  submitAnswer,
  toggleChoice,
} from '@cah/store';
import { createEffect, createSignal } from 'solid-js';

import { ChoicesList } from '../components/choices-list';
import { QuestionCard } from '../components/question-card';
import { Header } from '../layout/header';
import { View } from '../layout/view';
import { selector } from '../selector';
import { store } from '../store';

export function GameStartedView() {
  const cards = selector(selectPlayerCards);
  const selectedChoices = selector(selectedSelectedChoices);
  const chunks = selector(selectCurrentQuestionChunks);

  const canSubmitAnswer = selector(selectCanSubmitAnswer);

  const handleSubmitAnswer = () => {
    if (canSubmitAnswer()) {
      void store.dispatch(submitAnswer());
    }
  };

  const info = getInfo();

  return (
    <View class="overflow-hidden !p-0" header={<Header>{info()}</Header>}>
      <div class="p-4">
        <QuestionCard chunks={chunks()} onClick={handleSubmitAnswer} />
      </div>

      <ChoicesList
        choices={cards()}
        selectedChoices={selectedChoices()}
        onSelected={(choice) => store.dispatch(toggleChoice(choice))}
      />
    </View>
  );
}

const getInfo = () => {
  const playState = selector(selectPlayState);
  const isQuestionMaster = selector(selectIsQuestionMaster);
  const canSelectChoice = selector(selectCanSelectChoice);

  const [info, setInfo] = createSignal('');

  createEffect(() => {
    switch (playState()) {
      case PlayState.playersAnswer:
        if (canSelectChoice()) {
          setInfo('Fill the blanks and submit your answer');
        } else {
          setInfo('Wait for the other players to answer');
        }
        break;

      case PlayState.questionMasterSelection:
        if (isQuestionMaster()) {
          setInfo('Select an answer');
        } else {
          setInfo('Wait for the winner to be selected');
        }
        break;

      case PlayState.endOfTurn:
        if (isQuestionMaster()) {
          setInfo("Start the next turn when you're ready");
        } else {
          setInfo('Wait for next turn to start');
        }
        break;
    }
  });

  return info;
};
