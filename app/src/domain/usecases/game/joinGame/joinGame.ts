import { createThunk } from '../../../../store/createThunk';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { gameDtoToEntity } from '../../../transformers/gameDtoToEntity';
import { navigateToGameRoute } from '../../app/navigate/navigate';

export const joinGame = createThunk(async ({ dispatch, gameGateway }, gameCode: string) => {
  const gameDto = await gameGateway.joinGame(gameCode);

  dispatch(gameActions.setGame(gameDtoToEntity(gameDto)));
  dispatch(navigateToGameRoute('/idle'));
});
