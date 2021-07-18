import { Player } from '../../../interfaces/entities/Player';
import { createAction, ThunkResult } from '../../../store/createAction';
import { connect } from '../connect/connect';

export const setPlayer = createAction<Player, 'player/set'>('player/set');

export const login = (nick: string): ThunkResult<Promise<void>> => {
  return async (dispatch, _getState, { playerGateway }) => {
    const player = await playerGateway.login(nick);

    dispatch(setPlayer(player));
  };
};
