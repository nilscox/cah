import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { gameDtoToEntity } from '../../../transformers/gameDtoToEntity';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const createGame = createThunk(async ({ dispatch, gameGateway }) => {
  const gameDto = await gameGateway.createGame();

  dispatch(gameActions.setGame(gameDtoToEntity(gameDto)));
  dispatch(navigateToGameRoute('/idle'));
});
