import { createThunk } from '../../../../store/createThunk';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { Player } from '../../../entities/player';
import { initialize } from '../../app/initialize/initialize';

export const login = createThunk(async ({ dispatch, playerGateway }, nick: string) => {
  const playerDto = await playerGateway.login(nick);

  const player: Player = {
    id: playerDto.id,
    nick: playerDto.nick,
    isConnected: playerDto.isConnected,
    game: null,
  };

  dispatch(playerActions.setPlayer(player));

  await dispatch(initialize());
});
