import { assert } from '@cah/utils';

import { selectStartedGame } from '../../slices/game/game.selectors';
import { createThunk2 } from '../../store/create-thunk';

export const validateSelectedAnswer = createThunk2(async ({ client, getState }) => {
  const game = selectStartedGame(getState());
  assert(game.selectedAnswerId);

  await client.selectAnswer(game.selectedAnswerId);
});
