import { createAction } from '@reduxjs/toolkit';

import { NormalizedEntities } from '../normalization';

export const setEntities = createAction('set-entities', (entities: NormalizedEntities) => ({
  payload: entities,
}));
