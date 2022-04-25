import { createThunk } from '../../../../store/createThunk';
import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { selectPlayerUnsafe } from '../../../../store/selectors/playerSelectors';
import { networkStatusChanged, setAppReady, setGame, setPlayer, setTurns } from '../../../actions';
import { FullPlayer } from '../../../entities/Player';
import { redirect } from '../../game/redirect/redirect';
import { connect } from '../connect/connect';
import { setCards } from '../setCards/setCards';

const registerNetworkStatusListener = createThunk(({ dispatch, networkGateway }) => {
  if (networkGateway.networkStatus === NetworkStatus.down) {
    dispatch(networkStatusChanged(NetworkStatus.down));
  }

  networkGateway.onNetworkStatusChange((status) => dispatch(networkStatusChanged(status)));
});

const fetchPlayer = createThunk(async ({ dispatch, playerGateway }) => {
  const player = await playerGateway.fetchMe();

  if (player) {
    dispatch(setPlayer(player));
    dispatch(setCards(player.cards));
  }

  return player;
});

const fetchGame = createThunk(async ({ dispatch, gameGateway }, gameId: string) => {
  const game = await gameGateway.fetchGame(gameId);

  if (game) {
    dispatch(setGame(game));
    dispatch(setTurns(await gameGateway.fetchTurns(game.id)));
  }
});

export const initialize = createThunk(async ({ dispatch, getState }) => {
  let player: FullPlayer | undefined = selectPlayerUnsafe(getState()) ?? undefined;

  if (!player) {
    player = await dispatch(fetchPlayer());
  }

  if (player && !player.isConnected) {
    await dispatch(connect());
  }

  if (player?.gameId) {
    await dispatch(fetchGame(player.gameId));
  }

  dispatch(redirect());
  dispatch(registerNetworkStatusListener());
  dispatch(setAppReady());
});
