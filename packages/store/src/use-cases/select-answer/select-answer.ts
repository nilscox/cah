import { createThunk } from '../../store/create-thunk.ts';

export const selectAnswer = createThunk(async ({ client }, answerId: string) => {
  await client.selectAnswer(answerId);
});
