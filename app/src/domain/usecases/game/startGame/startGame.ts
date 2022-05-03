import { createThunk } from '../../../../store/createThunk';
import { Player } from '../../../entities/player';

export const startGame = createThunk(async ({ gameGateway }, questionMaster: Player | null, turns: number) => {
  await gameGateway.startGame(questionMaster, turns);
});
