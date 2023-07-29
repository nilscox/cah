import { gameSelectors } from '../../slices/game/game.selectors';
import { createThunk } from '../../store/create-thunk';

export const validateSelectedAnswer = createThunk(
  'validate-selected-answer',
  async ({ client, getState }) => {
    const game = gameSelectors.startedGame(getState());
    assert(game.selectedAnswerId);

    await client.selectAnswer(game.selectedAnswerId);
  },
);
