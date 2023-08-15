import { createThunk2 } from '../../store/create-thunk';

export const selectAnswer = createThunk2(async ({ client }, answerId: string) => {
  await client.selectAnswer(answerId);
});
