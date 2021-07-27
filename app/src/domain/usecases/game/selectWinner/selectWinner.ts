import { createThunk } from '../../../../store/createThunk';
import { AnonymousAnswer } from '../../../entities/Answer';

export const selectWinner = createThunk(async ({ gameGateway }, answer: AnonymousAnswer) => {
  await gameGateway.selectWinningAnswer(answer);
});
