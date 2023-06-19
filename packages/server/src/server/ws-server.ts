import { Server } from 'node:http';

import { Server as SocketIOServer } from 'socket.io';

import { EventPublisherPort } from 'src/adapters';
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

export class WsServer {
  private io: SocketIOServer;

  constructor(private readonly server: Server, publisher: EventPublisherPort) {
    this.io = new SocketIOServer(this.server);

    this.io.on('connection', (socket) => {
      publisher.publish(new PlayerConnectedEvent(''));

      socket.on('disconnect', () => {
        publisher.publish(new PlayerDisconnectedEvent(''));
      });
    });
  }

  get sockets() {
    return this.io.sockets;
  }
}
