import { classToPlain } from 'class-transformer';
import { RequestHandler } from 'express';
import { SessionData } from 'express-session';
import { Server } from 'http';
import { Socket } from 'socket.io';
import Container from 'typedi';

import { Game } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { GameEvent, GameEvents, PlayerEvent } from '../../domain/interfaces/GameEvents';
import { CreateGame } from '../../domain/use-cases/CreateGame';
import { GiveChoicesSelection } from '../../domain/use-cases/GiveChoicesSelection';
import { JoinGame } from '../../domain/use-cases/JoinGame';
import { NextTurn } from '../../domain/use-cases/NextTurn';
import { PickWinningAnswer } from '../../domain/use-cases/PickWinningAnswer';
import { QueryGame } from '../../domain/use-cases/QueryGame';
import { QueryPlayer } from '../../domain/use-cases/QueryPlayer';
import { StartGame } from '../../domain/use-cases/StartGame';
import { AllPlayersAnsweredDto } from '../dtos/events/AllPlayersAnsweredDto';
import { GameFinishedDto } from '../dtos/events/GameFinishedDto';
import { GameStartedDto } from '../dtos/events/GameStartedDto';
import { PlayerAnsweredDto } from '../dtos/events/PlayerAnsweredDto';
import { PlayerJoinedDto } from '../dtos/events/PlayerJoinedDto';
import { TurnEndedDto } from '../dtos/events/TurnEndedDto';
import { TurnStartedDto } from '../dtos/events/TurnStartedDto';
import { WinnerSelectedDto } from '../dtos/events/WinnerSelectedDto';
import { GiveChoicesSelectionDto } from '../dtos/inputs/GiveChoicesSelectionDto';
import { JoinGameDto } from '../dtos/inputs/JoinGameDto';
import { PickWinningAnswerDto } from '../dtos/inputs/PickWinningAnswer';
import { StartGameDto } from '../dtos/inputs/StartGameDto';

import { WebsocketServer } from './WebsocketServer';

const gameEventDtos = {
  PlayerJoined: PlayerJoinedDto,
  GameStarted: GameStartedDto,
  TurnStarted: TurnStartedDto,
  PlayerAnswered: PlayerAnsweredDto,
  AllPlayersAnswered: AllPlayersAnsweredDto,
  WinnerSelected: WinnerSelectedDto,
  TurnEnded: TurnEndedDto,
  GameFinished: GameFinishedDto,
};

export class WebsocketGameEvents extends WebsocketServer implements GameEvents {
  private sockets: Map<number, Socket> = new Map();

  constructor(server: Server, session: RequestHandler) {
    super(server, session);

    this.registerEventHandler('createGame', this.onCreateGame.bind(this));
    this.registerEventHandler('joinGame', JoinGameDto, this.onJoinGame.bind(this));
    this.registerEventHandler('startGame', StartGameDto, this.onStartGame.bind(this));
    this.registerEventHandler('giveChoicesSelection', GiveChoicesSelectionDto, this.onGiveChoicesSelection.bind(this));
    this.registerEventHandler('pickWinningAnswer', PickWinningAnswerDto, this.onPickWinningAnswer.bind(this));
    this.registerEventHandler('nextTurn', this.onNextTurn.bind(this));
  }

  override onSocketConnected(socket: Socket) {
    super.onSocketConnected(socket);

    const playerId = this.getPlayerId(socket);

    if (!playerId) {
      return socket.disconnect();
    }

    if (this.sockets.has(playerId)) {
      return socket.disconnect();
    }

    this.sockets.set(playerId, socket);
  }

  override onSocketDisconnected(socket: Socket) {
    super.onSocketDisconnected(socket);

    const playerId = this.getPlayerId(socket);

    if (playerId) {
      this.sockets.delete(playerId);
    }
  }

  join(game: Game, player: Player) {
    const socket = this.getClientSocket(player);

    socket.join(this.gameRoomName(game));
  }

  onPlayerEvent(player: Player, event: PlayerEvent): void {
    const socket = this.getClientSocket(player);

    socket.send(event);
  }

  onGameEvent(game: Game, event: GameEvent) {
    const Dto = gameEventDtos[event.type];
    const message = classToPlain(new Dto(event as any));

    this.broadcast(this.gameRoomName(game), message);
  }

  async onCreateGame(socket: Socket) {
    await this.getPlayer(socket);

    const game = await Container.get(CreateGame).createGame();

    return { game };
  }

  async onJoinGame(socket: Socket, payload: JoinGameDto) {
    const player = await this.getPlayer(socket);

    if (player.gameId) {
      throw new Error('player is already in game');
    }

    const game = await Container.get(JoinGame).joinGame(payload.code, player);

    this.join(game, player);

    return { game };
  }

  async onStartGame(socket: Socket, { numberOfTurns }: StartGameDto) {
    const { player, game } = await this.getInGamePlayer(socket);

    await Container.get(StartGame).startGame(game!, player, numberOfTurns);
  }

  async onGiveChoicesSelection(socket: Socket, { choicesIds }: GiveChoicesSelectionDto) {
    const { player, game } = await this.getInGamePlayer(socket);

    await Container.get(GiveChoicesSelection).giveChoicesSelection(game!, player, choicesIds);
  }

  async onPickWinningAnswer(socket: Socket, { answerId }: PickWinningAnswerDto) {
    const { player, game } = await this.getInGamePlayer(socket);

    await Container.get(PickWinningAnswer).pickWinningAnswer(game, player, answerId);
  }

  async onNextTurn(socket: Socket) {
    const { game } = await this.getInGamePlayer(socket);

    await Container.get(NextTurn).nextTurn(game);
  }

  private async getInGamePlayer(socket: Socket) {
    const player = await this.getPlayer(socket);

    if (!player.gameId) {
      throw new Error('player is not in game');
    }

    const game = await Container.get(QueryGame).queryGame(player.gameId);

    return { player, game: game as Game };
  }

  private getPlayerId(socket: Socket): number | undefined {
    const { playerId } = (socket.handshake as unknown as { session: SessionData }).session;

    return playerId;
  }

  private async getPlayer(socket: Socket): Promise<Player> {
    const playerId = this.getPlayerId(socket);

    if (!playerId) {
      throw new Error('player not authenticated');
    }

    const player = await Container.get(QueryPlayer).queryPlayer(playerId);

    if (!player) {
      throw new Error('player not found');
    }

    return player;
  }

  private gameRoomName(game: Game): string {
    return `game-${game.id}`;
  }

  private getClientSocket(player: Player): Socket {
    const socket = this.sockets.get(player.id!);

    if (!socket) {
      throw new Error('player is not connected');
    }

    return socket;
  }
}
