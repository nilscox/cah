import { RequestHandler } from 'express';
import { SessionData } from 'express-session';
import sharedsession from 'express-socket.io-session';
import { Server } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

import { Notifier } from '../../application/interfaces/Notifier';
import { RoomsManager } from '../../application/interfaces/RoomsManager';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';

export class WebsocketServer {
  private io: SocketIOServer;
  private sockets = new Map<string, Socket>();

  constructor(server: Server, session: RequestHandler) {
    this.io = new SocketIOServer(server);

    this.io.use(sharedsession(session));
    this.io.on('connection', (socket) => this.onSocketConnected(socket));
  }

  private onSocketConnected(socket: Socket) {
    const { playerId } = (socket.handshake as unknown as { session: SessionData }).session;

    if (playerId) {
      this.sockets.set(playerId, socket);
      socket.on('disconnect', () => this.sockets.delete(playerId));
    }
  }

  join(room: string, player: Player) {
    const socket = this.sockets.get(player.id);

    if (socket) {
      socket.join(room);
    }
  }

  emit(player: Player, message: unknown) {
    const socket = this.sockets.get(player.id);

    if (socket) {
      socket.emit('message', message);
    }
  }

  broadcast(room: string, message: unknown) {
    this.io.to(room).emit('message', message);
  }
}

export class WebsocketNotifier implements Notifier {
  public wss!: WebsocketServer;

  notifyPlayer<Message>(player: Player, message: Message): void {
    this.wss.emit(player, message);
  }

  notifyGamePlayers<Message>(game: Game, message: Message): void {
    this.wss.broadcast(game.roomId, message);
  }
}

export class WebsocketRoomsManager implements RoomsManager {
  wss!: WebsocketServer;

  join(room: string, player: Player): void {
    this.wss.join(room, player);
  }

  leave(_room: string, _player: Player): void {
    throw new Error('Method not implemented.');
  }
}
