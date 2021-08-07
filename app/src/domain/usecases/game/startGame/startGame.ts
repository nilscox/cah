import { createThunk } from '../../../../store/createThunk';
import { Player } from '../../../entities/Player';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const startGame = createThunk(async ({ dispatch, gameGateway }, questionMaster: Player, turns: number) => {
  await gameGateway.startGame(questionMaster, turns);

  dispatch(navigateToGameRoute('/started'));
});
