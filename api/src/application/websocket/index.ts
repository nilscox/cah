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
import { PickWinningAnswer } from '../../domain/use-cases/PickWinningAnswer';
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
    this.registerEventHandler('startGame', this.onStartGame.bind(this));
    this.registerEventHandler('giveChoicesSelection', GiveChoicesSelectionDto, this.onGiveChoicesSelection.bind(this));
    this.registerEventHandler('pickWinningAnswer', PickWinningAnswerDto, this.onPickWinningAnswer.bind(this));
  }

  onSocketConnected(socket: Socket) {
    super.onSocketConnected(socket);

    const playerId = this.getPlayerId(socket);

    if (!playerId) {
      return socket.disconnect(true);
    }

    if (this.sockets.has(playerId)) {
      return socket.disconnect(true);
    }

    this.sockets.set(playerId, socket);
  }

  onSocketDisconnected(socket: Socket) {
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
    const player = await this.getPlayer(socket);

    if (!player) {
      throw new Error('player not found');
    }

    const game = await Container.get(CreateGame).createGame();

    return { game };
  }

  async onJoinGame(socket: Socket, payload: JoinGameDto) {
    const player = await this.getPlayer(socket);

    if (!player) {
      throw new Error('player not found');
    }

    const game = await Container.get(JoinGame).joinGame(payload.code, player);

    this.join(game, player);
  }

  async onStartGame(socket: Socket) {
    const player = await this.getPlayer(socket);

    if (!player) {
      throw new Error('player not found');
    }

    if (!player.game) {
      throw new Error('player is not in game');
    }

    await Container.get(StartGame).startGame(player.game, player, 4);
  }

  async onGiveChoicesSelection(socket: Socket, { choicesIds }: GiveChoicesSelectionDto) {
    const player = await this.getPlayer(socket);

    if (!player) {
      throw new Error('player not found');
    }

    if (!player.game) {
      throw new Error('player is not in game');
    }

    await Container.get(GiveChoicesSelection).giveChoicesSelection(player.game, player, choicesIds);
  }

  async onPickWinningAnswer(socket: Socket, { answerId }: PickWinningAnswerDto) {
    const player = await this.getPlayer(socket);

    if (!player) {
      throw new Error('player not found');
    }

    if (!player.game) {
      throw new Error('player is not in game');
    }

    await Container.get(PickWinningAnswer).pickWinningAnswer(player.game, player, answerId);
  }

  private getPlayerId(socket: Socket): number | undefined {
    const { playerId }: SessionData = (socket.handshake as any).session;

    return playerId;
  }

  private async getPlayer(socket: Socket): Promise<Player | undefined> {
    const playerId = this.getPlayerId(socket);

    if (playerId) {
      return Container.get(QueryPlayer).queryPlayer(playerId);
    }
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
