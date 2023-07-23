import assert from 'node:assert';

import { Container, injectableClass } from 'ditox';

import { ConfigPort, EventPublisherPort, LoggerPort, RealEventPublisherAdapter } from 'src/adapters';
import { AnswerCreatedEvent } from 'src/commands/create-answer/create-answer';
import { GameCreatedEvent } from 'src/commands/create-game/create-game';
import { TurnEndedEvent } from 'src/commands/end-turn/end-turn';
import { PlayerJoinedEvent } from 'src/commands/join-game/join-game';
import { PlayerLeftEvent } from 'src/commands/leave-game/leave-game';
import { GameStartedEvent } from 'src/commands/start-game/start-game';
import { TurnStartedEvent } from 'src/commands/start-turn/start-turn';
import { TOKENS } from 'src/tokens';

import { HttpServer } from './http-server';
import { WsServer } from './ws-server';

export class Server {
  static inject = injectableClass(this, TOKENS.config, TOKENS.logger, TOKENS.publisher, TOKENS.container);

  private httpServer: HttpServer;
  private wsServer: WsServer;

  constructor(
    private readonly config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly publisher: EventPublisherPort,
    private readonly container: Container,
  ) {
    this.logger.context = 'Server';

    this.httpServer = new HttpServer(this.config, this.logger, this.container);
    this.wsServer = new WsServer(this.logger, this.httpServer.nodeServer, this.publisher);

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

    publisher.register(PlayerJoinedEvent, async (event) => {
      await this.wsServer.join(event.entityId, event.playerId);
    });

    publisher.register(PlayerLeftEvent, async (event) => {
      await this.wsServer.leave(event.entityId, event.playerId);
    });

    publisher.register(GameCreatedEvent, async (event) => {
      const joinGame = this.container.resolve(TOKENS.commands.joinGame);

      await joinGame.execute({
        playerId: event.creatorId,
        code: event.gameCode,
      });
    });

    publisher.register(GameStartedEvent, async (event) => {
      const startTurn = this.container.resolve(TOKENS.commands.startTurn);

      await startTurn.execute({
        gameId: event.entityId,
        questionMasterId: event.initialQuestionMasterId,
      });
    });

    publisher.register(TurnStartedEvent, async (event) => {
      const dealCards = this.container.resolve(TOKENS.commands.dealCards);

      await dealCards.execute({
        gameId: event.entityId,
      });
    });

    publisher.register(AnswerCreatedEvent, async (event) => {
      const handleEndOfPlayersAnswer = this.container.resolve(TOKENS.commands.handleEndOfPlayersAnswer);

      await handleEndOfPlayersAnswer.execute({
        answerId: event.entityId,
      });
    });

    publisher.register(TurnEndedEvent, async (event) => {
      if (event.hasMoreQuestions) {
        const startTurn = this.container.resolve(TOKENS.commands.startTurn);

        await startTurn.execute({
          gameId: event.entityId,
          questionMasterId: event.winnerId,
        });
      } else {
        const endGame = this.container.resolve(TOKENS.commands.endGame);

        await endGame.execute({
          gameId: event.entityId,
        });
      }
    });
  }
}
