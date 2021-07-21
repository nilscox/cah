import { Server } from 'http';

import { RequestHandler } from 'express';
import { SessionData } from 'express-session';
import sharedsession from 'express-socket.io-session';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { EventEmitter } from 'stream';

import { Notifier } from '../../application/interfaces/Notifier';
import { RTCManager } from '../../application/interfaces/RTCManager';
import { EventPublisher } from '../../ddd/EventPublisher';
import { DomainEvent } from '../../domain/events';
import { PlayerConnectedEvent } from '../../domain/events/PlayerConnectedEvent';
import { PlayerDisconnectedEvent } from '../../domain/events/PlayerDisconnectedEvent';
import { GameRepository } from '../../domain/interfaces/GameRepository';
import { PlayerRepository } from '../../domain/interfaces/PlayerRepository';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class WebsocketServer extends EventEmitter {
  private io?: SocketIOServer;
  private sockets = new Map<string, Socket>();

  connect(server: Server, session: RequestHandler) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: true,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.use(sharedsession(session));
    this.io.on('connection', (socket) => this.onSocketConnected(socket));
  }

  private onSocketConnected(socket: Socket) {
    const { playerId } = (socket.handshake as unknown as { session: SessionData }).session;

    if (playerId) {
      this.sockets.set(playerId, socket);

      socket.on('disconnect', (reason: string) => {
        this.sockets.delete(playerId);
        this.emit('playerDisconnected', playerId, reason);
      });

      this.emit('playerConnected', playerId);
    }
  }

  playerSocket(playerId: string) {
    return this.sockets.get(playerId);
  }

  broadcast(room: string, message: unknown) {
    this.io?.to(room).emit('message', message);
  }
}

export class WebsocketRTCManager implements RTCManager, Notifier {
  constructor(
    private readonly playerRepository: PlayerRepository,
    private readonly gameRepository: GameRepository,
    private readonly wss: WebsocketServer,
    private readonly publisher: EventPublisher<DomainEvent>,
  ) {
    wss.addListener('playerConnected', this.onPlayerConnected.bind(this));
    wss.addListener('playerDisconnected', this.onPlayerDisconnected.bind(this));
  }

  // todo: error handling
  private async onPlayerConnected(playerId: string) {
    const player = await this.playerRepository.findPlayerById(playerId);

    if (player?.gameId) {
      const game = await this.gameRepository.findGameById(player.gameId);

      if (game) {
        this.publisher.publish(new PlayerConnectedEvent(game, player));

        this.join(game, player);
      }
    }
  }

  private async onPlayerDisconnected(playerId: string, _reason: string) {
    const player = await this.playerRepository.findPlayerById(playerId);

    if (player?.gameId) {
      const game = await this.gameRepository.findGameById(player.gameId);

      if (game) {
        this.publisher.publish(new PlayerDisconnectedEvent(game, player));
      }
    }
  }

  isConnected(player: Player) {
    return this.wss.playerSocket(player.id) !== undefined;
  }

  join(game: Game, player: Player): void {
    const socket = this.wss.playerSocket(player.id);

    if (socket) {
      socket.join(game.roomId);
    }
  }

  leave(_game: Game, _player: Player): void {
    throw new Error('Method not implemented.');
  }

  notifyPlayer<Message>(player: Player, message: Message): void {
    const socket = this.wss.playerSocket(player.id);

    if (socket) {
      socket.emit('message', message);
    }
  }

  notifyGamePlayers<Message>(game: Game, message: Message): void {
    this.wss.broadcast(game.roomId, message);
  }
}
