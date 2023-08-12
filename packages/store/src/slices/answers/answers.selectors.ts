import { pipe } from '@nilscox/selektor';

import { defined } from '../../defined';
import { AppState } from '../../types';

import { answersAdapter } from './answers.slice';

export const {
  selectEntities: selectAnswers,
  selectAll: selectAllAnswers,
  selectById: selectAnswerById,
} = answersAdapter.getSelectors((state: AppState) => state.answers);

export const byIds = pipe(selectAnswers, (answers, ids: string[]) => {
  return ids.map((id) => defined(answers[id]));
});
