import { Player } from '../../../interfaces/entities/Player';
import { createThunk } from '../../../store/createThunk';

export const startGame = createThunk(async ({ gameGateway }, questionMaster: Player, turns: number) => {
  await gameGateway.startGame(questionMaster, turns);
});
