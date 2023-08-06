import { gameSelectors } from '../../slices/game/game.selectors';
import { createThunk2 } from '../../store/create-thunk';

export const validateSelectedAnswer = createThunk2(async ({ client, getState }) => {
  const game = gameSelectors.startedGame(getState());
  assert(game.selectedAnswerId);

  await client.selectAnswer(game.selectedAnswerId);
});
