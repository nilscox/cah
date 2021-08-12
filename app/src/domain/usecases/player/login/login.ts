import { createThunk } from '../../../../store/createThunk';
import { setPlayer } from '../../../actions';
import { initialize } from '../initialize/initialize';
import { setCards } from '../setCards/setCards';

export const login = createThunk(async ({ dispatch, playerGateway }, nick: string) => {
  const player = await playerGateway.login(nick);

  dispatch(setPlayer(player));
  dispatch(setCards(player.cards));

  await dispatch(initialize());
});
