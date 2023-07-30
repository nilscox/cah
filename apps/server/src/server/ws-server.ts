import assert from 'node:assert';
import { IncomingMessage, Server } from 'node:http';
import { promisify } from 'node:util';

import { MapSet } from '@cah/utils';
import { RequestHandler } from 'express';
import session from 'express-session';
import { Socket, Server as SocketIOServer } from 'socket.io';

import { EventPublisherPort, LoggerPort, RtcPort } from 'src/adapters';
import { DomainEvent } from 'src/interfaces';
import { PlayerRepository } from 'src/persistence';

export class PlayerConnectedEvent extends DomainEvent {
  constructor(playerId: string) {
    super('player', playerId);
  }
}

export class PlayerDisconnectedEvent extends DomainEvent {
  constructor(playerId: string) {
    super('player', playerId);
  }
}

export class WsServer implements RtcPort {
  private io: SocketIOServer;
  private sockets = new MapSet<string, Socket>();

  constructor(
    private readonly logger: LoggerPort,
    private readonly server: Server,
    private readonly publisher: EventPublisherPort,
    private readonly playerRepository: PlayerRepository,
  ) {
    this.io = new SocketIOServer(this.server);

    this.io.on('connection', this.onConnection);
  }

  use(handler: RequestHandler) {
    this.io.engine.use(handler);
  }

  private onConnection = async (socket: Socket) => {
    try {
      const request = socket.request as IncomingMessage & { session: session.SessionData };
      const playerId = request.session.playerId;
      assert(typeof playerId === 'string', 'invalid session');

      const player = await this.playerRepository.findById(playerId);

      void socket.join(playerId);

      if (player.gameId) {
        void socket.join(player.gameId);
      }

      this.sockets.add(playerId, socket);
      this.publisher.publish(new PlayerConnectedEvent(playerId));

      socket.on('disconnect', () => {
        this.sockets.remove(playerId, socket);
        this.publisher.publish(new PlayerDisconnectedEvent(playerId));
      });
    } catch (error) {
      console.error(error);
    }
  };

  async close() {
    await promisify<void>((cb) => this.io.close(cb))();
  }

  async join(room: string, playerId: string): Promise<void> {
    const sockets = this.sockets.get(playerId);

    if (!sockets?.size) {
      return;
    }

    this.logger.verbose('join', room, playerId);

    for (const socket of sockets.values()) {
      await socket.join(room);
    }
  }

  async leave(room: string, playerId: string): Promise<void> {
    const sockets = this.sockets.get(playerId);

    if (!sockets?.size) {
      return;
    }

    this.logger.verbose('leave', room, playerId);

    for (const socket of sockets.values()) {
      await socket.leave(room);
    }
  }

  async send(to: string, message: unknown): Promise<void> {
    this.logger.verbose('send', to, message);
    this.io.to(to).emit('message', message);
  }
}
