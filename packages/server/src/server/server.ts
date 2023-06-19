import assert from 'node:assert';

import { Container } from 'ditox';

import { ConfigPort, EventPublisherPort, LoggerPort, RealEventPublisherAdapter } from 'src/adapters';
import { GameCreatedEvent } from 'src/commands/game/create-game/create-game';
import { TOKENS } from 'src/tokens';

import { HttpServer } from './http-server';
import { WsServer } from './ws-server';

/* eslint-disable @typescript-eslint/no-misused-promises */

export class Server {
  private httpServer: HttpServer;
  private wsServer: WsServer;

  constructor(
    config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly publisher: EventPublisherPort,
    private readonly container: Container
  ) {
    this.logger.context = 'Server';

    this.httpServer = new HttpServer(config, logger, container);
    this.wsServer = new WsServer(this.httpServer.nodeServer, this.publisher);

    this.configure();
  }

  get address() {
    const addr = this.httpServer.nodeServer.address();

    if (typeof addr !== 'object' || addr === null) {
      return;
    }

    return `${addr.address}:${addr.port}`;
  }

  get listening() {
    return this.httpServer.nodeServer.listening;
  }

  async listen() {
    await this.httpServer.listen();
  }

  async close() {
    this.logger.verbose('closing server');

    await this.wsServer.close();
    await this.httpServer.close();

    this.logger.info('server closed');
  }
  }

  private configure() {
    const publisher = this.container.resolve(TOKENS.publisher);
    assert(publisher instanceof RealEventPublisherAdapter);

    publisher.register(GameCreatedEvent, async (event) => {
      const addPlayer = this.container.resolve(TOKENS.commands.addPlayer);

      await addPlayer.execute({
        gameId: event.entityId,
        playerId: event.creatorId,
      });
    });
  }
}
