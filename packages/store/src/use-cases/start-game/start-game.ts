import { createThunk } from '../../store/create-thunk';

export const startGame = createThunk('start-game', async ({ client }, numberOfQuestions: number) => {
  await client.startGame(numberOfQuestions);
});
