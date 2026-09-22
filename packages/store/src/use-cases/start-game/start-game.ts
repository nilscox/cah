import { createThunk } from '../../store/create-thunk.ts';

export const startGame = createThunk(async ({ client }, numberOfQuestions: number) => {
  await client.startGame(numberOfQuestions);
});
