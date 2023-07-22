import assert from 'node:assert';
import { IncomingMessage, Server } from 'node:http';
import { promisify } from 'node:util';

import { RequestHandler } from 'express';
import session from 'express-session';
import { Socket, Server as SocketIOServer } from 'socket.io';

import { EventPublisherPort, LoggerPort, RtcPort } from 'src/adapters';
import { DomainEvent } from 'src/interfaces';

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

  constructor(
    private readonly logger: LoggerPort,
    private readonly server: Server,
    private readonly publisher: EventPublisherPort,
  ) {
    this.io = new SocketIOServer(this.server);

    this.io.on('connection', this.onConnection);
  }

  use(handler: RequestHandler) {
    this.io.engine.use(handler);
  }

  private onConnection = async (socket: Socket) => {
    const request = socket.request as IncomingMessage & { session: session.SessionData };
    const playerId = request.session.playerId;
    assert(typeof playerId === 'string', 'invalid session');

    socket.data.playerId = playerId;
    void socket.join(playerId);

    this.publisher.publish(new PlayerConnectedEvent(playerId));

    socket.on('disconnect', () => {
      this.publisher.publish(new PlayerDisconnectedEvent(playerId));
    });
  };

  async close() {
    await promisify<void>((cb) => this.io.close(cb))();
  }

  get sockets() {
    return this.io.sockets;
  }

  private async socket(playerId: string) {
    const sockets = await this.io.fetchSockets();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return sockets.find((socket) => socket.data.playerId === playerId);
  }

  async join(room: string, playerId: string): Promise<void> {
    const socket = await this.socket(playerId);

    assert(socket, `cannot find socket "${playerId}"`);

    this.logger.verbose('join', room, playerId);
    socket.join(room);
  }

  async leave(room: string, playerId: string): Promise<void> {
    const socket = await this.socket(playerId);

    assert(socket, `cannot find socket "${playerId}"`);

    this.logger.verbose('leave', room, playerId);
    socket.leave(room);
  }

  async send(to: string, message: unknown): Promise<void> {
    this.logger.verbose('send', to, message);
    this.io.to(to).emit('message', message);
  }
}
