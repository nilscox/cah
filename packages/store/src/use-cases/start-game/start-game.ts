import { createThunk } from '../../store/create-thunk';

export const startGame = createThunk(async ({ client }, numberOfQuestions: number) => {
  await client.startGame(numberOfQuestions);
});
