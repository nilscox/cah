import { createThunk2 } from '../../store/create-thunk';

export const startGame = createThunk2(async ({ client }, numberOfQuestions: number) => {
  await client.startGame(numberOfQuestions);
});
