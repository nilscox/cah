import { PlayState, selectCanSelectChoice, selectIsQuestionMaster, selectPlayState } from '@cah/store';
import { Show, createEffect, createSignal } from 'solid-js';

import { AnswersList } from '../components/answers-list';
import { Header } from '../layout/header';
import { View } from '../layout/view';
import { selector } from '../utils/selector';

import { PlayersAnswer } from './players-answer';

export function GameStartedView() {
  const info = getInfo();
  const playState = selector(selectPlayState);

  return (
    <View class="overflow-hidden !p-0" header={<Header>{info()}</Header>}>
      <Show when={playState() === PlayState.playersAnswer} fallback={<AnswersList />}>
        <PlayersAnswer />
      </Show>
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
          setInfo('Wait for an answer to be selected');
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
