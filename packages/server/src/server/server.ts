import assert from 'node:assert';

import { Container, injectableClass } from 'ditox';

import { ConfigPort, EventPublisherPort, LoggerPort, RealEventPublisherAdapter } from 'src/adapters';
import { AnswerCreatedEvent } from 'src/commands/create-answer/create-answer';
import { GameCreatedEvent } from 'src/commands/create-game/create-game';
import { GameEndedEvent } from 'src/commands/end-game/end-game';
import { TurnEndedEvent } from 'src/commands/end-turn/end-turn';
import { PlayerJoinedEvent } from 'src/commands/join-game/join-game';
import { PlayerLeftEvent } from 'src/commands/leave-game/leave-game';
import { GameStartedEvent } from 'src/commands/start-game/start-game';
import { TurnStartedEvent } from 'src/commands/start-turn/start-turn';
import { PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

import { HttpServer } from './http-server';
import { WsServer } from './ws-server';

export class Server {
  static inject = injectableClass(
    this,
    TOKENS.config,
    TOKENS.logger,
    TOKENS.publisher,
    TOKENS.repositories.player,
    TOKENS.container,
  );

  private httpServer: HttpServer;
  private wsServer: WsServer;

  constructor(
    private readonly config: ConfigPort,
    private readonly logger: LoggerPort,
    private readonly publisher: EventPublisherPort,
    private readonly playerRepository: PlayerRepository,
    private readonly container: Container,
  ) {
    this.logger.context = 'Server';

    this.httpServer = new HttpServer(this.config, this.logger, this.container);

    this.wsServer = new WsServer(
      this.logger,
      this.httpServer.nodeServer,
      this.publisher,
      this.playerRepository,
    );

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
      this.logger.info('player joined', { gameId: event.entityId, playerId: event.playerId });

      await this.wsServer.join(event.entityId, event.playerId);
    });

    publisher.register(PlayerLeftEvent, async (event) => {
      this.logger.info('player left', { gameId: event.entityId, playerId: event.playerId });

      await this.wsServer.leave(event.entityId, event.playerId);
    });

    publisher.register(GameCreatedEvent, async (event) => {
      this.logger.info('game created', { entityId: event.entityId, playerId: event.creatorId });

      const joinGame = this.container.resolve(TOKENS.commands.joinGame);

      await joinGame.execute({
        playerId: event.creatorId,
        code: event.gameCode,
      });
    });

    publisher.register(GameStartedEvent, async (event) => {
      this.logger.info('game started', { gameId: event.entityId });

      const startTurn = this.container.resolve(TOKENS.commands.startTurn);

      await startTurn.execute({
        gameId: event.entityId,
        questionMasterId: event.initialQuestionMasterId,
      });
    });

    publisher.register(TurnStartedEvent, async (event) => {
      this.logger.info('turn started', { gameId: event.entityId });

      const dealCards = this.container.resolve(TOKENS.commands.dealCards);

      await dealCards.execute({
        gameId: event.entityId,
      });
    });

    publisher.register(AnswerCreatedEvent, async (event) => {
      this.logger.info('answer created', { gameId: event.entityId });

      const handleEndOfPlayersAnswer = this.container.resolve(TOKENS.commands.handleEndOfPlayersAnswer);

      await handleEndOfPlayersAnswer.execute({
        answerId: event.entityId,
      });
    });

    publisher.register(TurnEndedEvent, async (event) => {
      this.logger.info('turn ended', { gameId: event.entityId, winnerId: event.winnerId });

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

    publisher.register(GameEndedEvent, async (event) => {
      this.logger.info('game ended', { gameId: event.entityId });
    });
  }
}
