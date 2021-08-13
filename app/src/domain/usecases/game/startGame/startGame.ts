import { createThunk } from '../../../../store/createThunk';
import { Player } from '../../../entities/Player';

export const startGame = createThunk(async ({ gameGateway }, questionMaster: Player, turns: number) => {
  await gameGateway.startGame(questionMaster, turns);
});
