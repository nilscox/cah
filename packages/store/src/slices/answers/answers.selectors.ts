import { Choice } from '@cah/shared';
import { combine, pipe } from '@nilscox/selektor';

import { denormalizeAnswer, selectNormalizedState } from '../../normalization';
import { AppState } from '../../types';

import { answersAdapter } from './answers.slice';

export type AnswerViewModel = {
  id: string;
  choices: Choice[];
  playerId?: string;
};

const selectors = answersAdapter.getSelectors((state: AppState) => state.answers);

export const selectAnswers = combine(
  selectNormalizedState,
  selectors.selectIds,
  (state, answersIds): Record<string, AnswerViewModel> => {
    return answersIds.reduce(
      (obj, answerId) => ({
        ...obj,
        [answerId]: denormalizeAnswer(state, answerId as string),
      }),
      {},
    );
  },
);

export const selectAllAnswers = pipe(selectAnswers, (answers) => {
  return Object.values(answers);
});

export const selectAnswerById = pipe(selectNormalizedState, (state, answerId: string) => {
  return denormalizeAnswer(state, answerId);
});
