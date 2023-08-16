import { createThunk } from '../../store/create-thunk';

export const selectAnswer = createThunk(async ({ client }, answerId: string) => {
  await client.selectAnswer(answerId);
});
