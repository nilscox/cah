import { createSelector } from 'reselect';

import { gameQuestion } from './game';

export const player = state => state.player;

export const playerCards = createSelector(
  player,
  (player) => player.cards,
);

export const playerSelectedChoices = createSelector(
  player,
  player => player.selectedChoices.filter(i => i !== null),
);

export const playerSubmittedAnswer = createSelector(
  player,
  player => player.submitted ? player.submitted.answers : [],
);

export const playerIsChoiceSelected = createSelector(
  playerSelectedChoices,
  choices => choice => choices
    .filter((c) => c && c.id === choice.id)
    .length > 0,
);

export const playerCanToggleChoice = createSelector(
  gameQuestion,
  playerSelectedChoices,
  playerSubmittedAnswer,
  (question, selectedChoices, submitted) => choice => {
    if (submitted.length)
      return false;

    if (selectedChoices.length === question.nb_choices)
      return choice.isSelected;

    return true;
  },
);

export const playerCanSubmitAnswer = createSelector(
  gameQuestion,
  playerSelectedChoices,
  playerSubmittedAnswer,
  (question, selectedChoices, submitted) => {
    if (submitted.length)
      return false;

    return selectedChoices.length === question.nb_choices;
  },
);
