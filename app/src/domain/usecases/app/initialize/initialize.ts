import { GameDto, isGameStartedDto, StartedGameDto } from '../../../../../../shared/dtos';
import { createThunk } from '../../../../store/createThunk';
import { NetworkStatus } from '../../../../store/reducers/appStateReducer';
import { appActions } from '../../../../store/slices/app/app.actions';
import { gameActions } from '../../../../store/slices/game/game.actions';
import { playerActions } from '../../../../store/slices/player/player.actions';
import { selectPlayer } from '../../../../store/slices/player/player.selectors';
import { networkStatusChanged } from '../../../actions';
import { Game, StartedGame } from '../../../entities/game';
import { gameDtoToEntity } from '../../../transformers/gameDtoToEntity';
import { turnDtoToEntity } from '../../../transformers/turnDtoToEntity';
import { redirect } from '../../game/redirect/redirect';
import { setCards } from '../../player/setCards/setCards';
import { connect } from '../connect/connect';

const registerNetworkStatusListener = createThunk(({ dispatch, networkGateway }) => {
  if (networkGateway.networkStatus === NetworkStatus.down) {
    dispatch(networkStatusChanged(NetworkStatus.down));
  }

  networkGateway.onNetworkStatusChange((status) => dispatch(networkStatusChanged(status)));
});

const fetchPlayer = createThunk(async ({ dispatch, playerGateway }) => {
  const playerDto = await playerGateway.fetchMe();

  if (playerDto) {
    dispatch(
      playerActions.setPlayer({
        id: playerDto.id,
        nick: playerDto.nick,
        isConnected: playerDto.isConnected,
        game: null,
      }),
    );
  }

  return playerDto;
});

const fetchGame = createThunk(async ({ dispatch, gameGateway }, gameId: string) => {
  const gameDto = await gameGateway.fetchGame(gameId);

  if (!gameDto) {
    throw new Error(`game with id "${gameId}" not found`);
  }

  const game: Game | StartedGame = gameDtoToEntity(gameDto);

  if (isGameStartedDto(gameDto)) {
    const startedGameAttributes: Omit<StartedGameDto, keyof GameDto> = {
      playState: gameDto.playState,
      totalQuestions: gameDto.totalQuestions,
      questionMaster: gameDto.questionMaster,
      question: gameDto.question,
      answers: gameDto.answers,
      winner: gameDto.winner,
    };

    Object.assign(game, startedGameAttributes);
  }

  dispatch(gameActions.setGame(game));

  if (isGameStartedDto(gameDto)) {
    const turns = await gameGateway.fetchTurns(gameDto.id);

    dispatch(gameActions.addTurns(turns.map(turnDtoToEntity)));
  }
});

export const initialize = createThunk(async ({ dispatch, getState }) => {
  let player = selectPlayer(getState());

  if (player.id === '') {
    const playerDto = await dispatch(fetchPlayer());
    const gameId = playerDto?.gameId;

    if (gameId) {
      await dispatch(fetchGame(gameId));

      dispatch(playerActions.initializePlayerGame(gameId));
      dispatch(setCards(playerDto.cards));
    }

    player = selectPlayer(getState());
  }

  if (player && !player.isConnected) {
    await dispatch(connect());
  }

  dispatch(redirect());
  dispatch(registerNetworkStatusListener());
  dispatch(appActions.setAppReady());
});
