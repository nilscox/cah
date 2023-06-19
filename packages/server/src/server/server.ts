import assert from 'node:assert';

import { Container } from 'ditox';

import { ConfigPort, EventPublisherPort, LoggerPort, RealEventPublisherAdapter } from 'src/adapters';
import { GameCreatedEvent } from 'src/commands/create-game/create-game';
import { TOKENS } from 'src/tokens';

import { HttpServer } from './http-server';
import { WsServer } from './ws-server';

export class Server {
  private httpServer: HttpServer;
  private wsServer: WsServer;

  constructor(
    private readonly config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly publisher: EventPublisherPort,
    private readonly container: Container
  ) {
    this.logger.context = 'Server';

    this.httpServer = new HttpServer(this.config, this.logger, this.container);
    this.wsServer = new WsServer(this.httpServer.nodeServer, this.publisher);

    this.wsServer.use(this.httpServer.sessionMiddleware);

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

  get rtc() {
    return this.wsServer;
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

  private configure() {
    const publisher = this.container.resolve(TOKENS.publisher);
    assert(publisher instanceof RealEventPublisherAdapter);

    publisher.register(GameCreatedEvent, async (event) => {
      const joinGame = this.container.resolve(TOKENS.commands.joinGame);

      await joinGame.execute({
        gameId: event.entityId,
        playerId: event.creatorId,
      });
    });
  }
}
