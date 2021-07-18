import { RequestHandler } from 'express';
import { SessionData } from 'express-session';
import sharedsession from 'express-socket.io-session';
import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

import { Notifier } from '../../application/interfaces/Notifier';
import { RTCManager } from '../../application/interfaces/RTCManager';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class WebsocketServer {
  private io: SocketIOServer;
  private sockets = new Map<string, Socket>();

  constructor(server: Server, session: RequestHandler) {
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
      socket.on('disconnect', () => {
        this.sockets.delete(playerId);
      });
    }
  }

  playerSocket(playerId: string) {
    return this.sockets.get(playerId);
  }

  broadcast(room: string, message: unknown) {
    this.io.to(room).emit('message', message);
  }
}

export class WebsocketRTCManager implements RTCManager, Notifier {
  wss!: WebsocketServer;

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
