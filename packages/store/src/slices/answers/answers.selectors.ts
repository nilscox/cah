import { AppState } from '../../types';

import { answersAdapter } from './answers.slice';

const { selectById: byId } = answersAdapter.getSelectors((state: AppState) => state.answers);

export const answersSelectors = {
  byId,
};
