import { assert } from '@cah/utils';
import { combine, createSelector, pipe } from '@nilscox/selektor';

import { defined } from '../../defined';
import { AppState } from '../../types';
import { selectChoices } from '../choices/choices.selectors';
import { selectCurrentQuestion, selectStartedGame } from '../game/game.selectors';
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

export const selectCurrentQuestionChunks = combine(
  selectCurrentQuestion,
  selectedSelectedChoices,
  (question, choices) => {
    assert(question);
    return getQuestionChunks(question, choices);
  },
);

export const selectCanSubmitAnswer = combine(
  selectIsQuestionMaster,
  selectedSelectedChoices,
  (isQuestionMaster, choices) => {
    if (isQuestionMaster) {
      return false;
    }

    return choices.every((choice) => choice !== null);
  },
);
