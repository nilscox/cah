import { createSelector } from 'reselect';

import { gameQuestionSelector } from './game';

export const playerSelector = state => state.player;

export const playerCardsSelector = createSelector(
  playerSelector,
  (player) => player.cards,
);

export const playerSelectedChoicesSelector = createSelector(
  playerSelector,
  player => player.selectedChoices.filter(i => i !== null),
);

export const playerSubmittedAnswerSelector = createSelector(
  playerSelector,
  player => player.submitted ? player.submitted.answers : [],
);

export const playerIsChoiceSelectedSelector = createSelector(
  playerSelectedChoicesSelector,
  choices => choice => choices
    .filter((c) => c && c.id === choice.id)
    .length > 0,
);

export const playerCanToggleChoice = createSelector(
  gameQuestionSelector,
  playerSelectedChoicesSelector,
  playerSubmittedAnswerSelector,
  (question, selectedChoices, submitted) => choice => {
    if (submitted)
      return false;

    if (selectedChoices.length === question.nb_choices)
      return choice.isSelected;

    return true;
  },
);

export const playerCanSubmitAnswer = createSelector(
  gameQuestionSelector,
  playerSelectedChoicesSelector,
  playerSubmittedAnswerSelector,
  (question, selectedChoices, submitted) => {
    if (submitted)
      return false;

    return selectedChoices.length === question.nb_choices;
  },
);
