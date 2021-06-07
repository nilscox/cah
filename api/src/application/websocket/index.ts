import { classToPlain } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsString, Length, validate, ValidationError } from 'class-validator';
import { SessionData } from 'express-session';
import sharedSession from 'express-socket.io-session';
import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
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
import { session } from '../web';

class ValidationErrors extends Error {
  constructor(public errors: ValidationError[]) {
    super('validation errors');
    Object.setPrototypeOf(this, ValidationErrors.prototype);
  }

  getErrors() {
    return this.errors.reduce((obj, error) => ({ ...obj, [error.property]: Object.keys(error.constraints ?? {}) }), {});
  }
}

const handleEvent = <Payload, Result>(
  socket: Socket,
  Dto: { new (): Payload } | undefined,
  handler: (payload: Payload, player: Player) => Promise<Result>,
) => {
  return async (payload: unknown, cb: (...args: unknown[]) => void) => {
    const { playerId }: SessionData = (socket.handshake as any).session;

    try {
      const player = await Container.get(QueryPlayer).queryPlayer(playerId);

      if (!player) {
        throw new Error('player not found');
      }

      let data: Payload | undefined = undefined;

      if (Dto) {
        data = Object.assign(new Dto(), payload);

        const errors = await validate(data as any);

        if (errors.length > 0) {
          throw new ValidationErrors(errors);
        }
      }

      const result = await handler(data as Payload, player);

      cb({ status: 'ok', ...classToPlain(result) });
    } catch (error) {
      if (error instanceof ValidationErrors) {
        cb({ status: 'ko', error: error.message, validationErrors: error.getErrors(), stack: error.stack });
      } else {
        cb({ status: 'ko', error: error.message, stack: error.stack });
      }
    }
  };
};

class JoinGameDto {
  @IsString()
  @Length(4, 4)
  code!: string;
}

class GiveChoicesSelectionDto {
  @IsInt({ each: true })
  @IsNotEmpty()
  choicesIds!: number[];
}

class PickWinningAnswerDto {
  @IsInt()
  @IsPositive()
  answerId!: number;
}

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

export class WebsocketServer implements GameEvents {
  private io: SocketIOServer;
  private sockets: Map<number, Socket> = new Map();

  constructor(server: Server) {
    this.io = new SocketIOServer(server);

    this.io.use(sharedSession(session));
    this.io.on('connection', (socket) => this.onSocketConnected(socket));
  }

  onSocketConnected(socket: Socket) {
    const playerId = this.getPlayerId(socket);

    if (!playerId) {
      return socket.disconnect(true);
    }

    if (this.sockets.has(playerId)) {
      return socket.disconnect(true);
    }

    this.sockets.set(playerId, socket);

    socket.on('disconnect', () => this.onSocketDisconnected(socket));

    socket.on(
      'createGame',
      handleEvent(socket, undefined, async () => {
        const game = await Container.get(CreateGame).createGame();
        return { game };
      }),
    );

    socket.on(
      'joinGame',
      handleEvent(socket, JoinGameDto, async (payload, player) => {
        const game = await Container.get(JoinGame).joinGame(payload.code, player);

        this.join(game, player);
      }),
    );

    socket.on(
      'startGame',
      handleEvent(socket, undefined, async (_payload, player) => {
        if (!player.game) {
          throw new Error('player is not in game');
        }

        await Container.get(StartGame).startGame(player.game, player, 4);
      }),
    );

    socket.on(
      'giveChoicesSelection',
      handleEvent(socket, GiveChoicesSelectionDto, async ({ choicesIds }, player) => {
        if (!player.game) {
          throw new Error('player is not in game');
        }

        await Container.get(GiveChoicesSelection).giveChoicesSelection(player.game, player, choicesIds);
      }),
    );

    socket.on(
      'pickWinningAnswer',
      handleEvent(socket, PickWinningAnswerDto, async ({ answerId }, player) => {
        if (!player.game) {
          throw new Error('player is not in game');
        }

        await Container.get(PickWinningAnswer).pickWinningAnswer(player.game, player, answerId);
      }),
    );
  }

  onSocketDisconnected(socket: Socket) {
    const playerId = this.getPlayerId(socket);

    if (playerId) {
      this.sockets.delete(playerId);
    }
  }

  getPlayerId(socket: Socket): number | undefined {
    const { playerId }: SessionData = (socket.handshake as any).session;

    return playerId;
  }

  join(game: Game, player: Player) {
    const socket = this.getClientSocket(player);

    socket.join(this.gameRoomName(game));
  }

  emit(game: Game, to: Player, event: PlayerEvent): void {
    const socket = this.getClientSocket(to);

    socket.send(event);
  }

  broadcast(game: Game, event: GameEvent): void {
    const Dto = gameEventDtos[event.type];
    const message = classToPlain(new Dto(event as any), { strategy: 'excludeAll' });

    this.io.to(this.gameRoomName(game)).emit('message', message);
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
