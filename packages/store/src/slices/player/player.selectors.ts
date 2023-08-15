import { Choice } from '@cah/shared';
import { assert } from '@cah/utils';
import { combine, createSelector, pipe } from '@nilscox/selektor';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { selectChoices } from '../choices/choices.selectors';
import {
  selectCurrentQuestion,
  selectPlayState,
  selectStartedGame,
  selectedSelectedAnswer,
} from '../game/game.selectors';
import { PlayState } from '../game/game.slice';
import { getQuestionChunks } from '../questions/question-chunks';

const selectPlayerUnsafe = createSelector((state: AppState) => state.player);

export const selectHasPlayer = pipe(selectPlayerUnsafe, (player) => player !== null);
export const selectPlayer = pipe(selectPlayerUnsafe, (player) => defined(player));

export const selectIsQuestionMaster = combine(
  selectStartedGame,
  selectPlayer,
  (game, player) => player.id === game.questionMasterId,
);

export const selectPlayerCards = combine(selectPlayer, selectChoices, (player, choices) => {
  assert(player.cardsIds);
  return player.cardsIds.map((choiceId) => defined(choices[choiceId]));
});

export const selectedSelectedChoices = combine(selectPlayer, selectChoices, (player, choices) => {
  assert(player.selectedChoicesIds);

  return player.selectedChoicesIds.map((choiceId) => {
    if (choiceId === null) {
      return null;
    }

    return defined(choices[choiceId]);
  });
});

export const selectCurrentQuestionChunks = pipe(
  selectCurrentQuestion,
  (question, choices: Array<Choice | null>) => {
    assert(question);
    return getQuestionChunks(question, choices);
  },
);

export const selectHasSubmittedAnswer = pipe(selectPlayer, (player) => player.answerSubmitted);

export const selectCanSelectChoice = combine(
  selectPlayState,
  selectHasSubmittedAnswer,
  selectIsQuestionMaster,
  (playState, selectHasSubmittedAnswer, isQuestionMaster) => {
    if (playState !== PlayState.playersAnswer) {
      return false;
    }

    if (selectHasSubmittedAnswer) {
      return false;
    }

    return !isQuestionMaster;
  },
);

export const selectCanSubmitAnswer = combine(
  selectHasSubmittedAnswer,
  selectIsQuestionMaster,
  selectedSelectedChoices,
  (hasSubmittedAnswer, isQuestionMaster, choices) => {
    if (hasSubmittedAnswer) {
      return false;
    }

    if (isQuestionMaster) {
      return false;
    }

    return choices.every((choice) => choice !== null);
  },
);

export const selectCanSelectAnswer = combine(
  selectPlayState,
  selectIsQuestionMaster,
  selectedSelectedAnswer,
  (playState, isQuestionMaster, selectedAnswer) => {
    if (playState !== PlayState.questionMasterSelection) {
      return false;
    }

    if (!isQuestionMaster) {
      return false;
    }

    return !selectedAnswer;
  },
);

export const selectCanEndTurn = combine(
  selectPlayState,
  selectIsQuestionMaster,
  (playState, isQuestionMaster) => {
    if (playState !== PlayState.endOfTurn) {
      return false;
    }

    return isQuestionMaster;
  },
);
