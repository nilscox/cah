import { expect } from 'chai';
import { io, Socket } from 'socket.io-client';
import request from 'supertest';
import { Container } from 'typedi';
import { getConnection, getCustomRepository } from 'typeorm';

import { app } from './application';
import { AnswerRepositoryToken } from './domain/interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from './domain/interfaces/ChoiceRepository';
import { GameEventsToken } from './domain/interfaces/GameEvents';
import { GameRepositoryToken } from './domain/interfaces/GameRepository';
import { PlayerRepositoryToken } from './domain/interfaces/PlayerRepository';
import { QuestionRepositoryToken } from './domain/interfaces/QuestionRepository';
import { TurnRepositoryToken } from './domain/interfaces/TurnRepository';
import { RandomServiceToken } from './domain/services/RandomService';
import { StubGameEvents } from './domain/tests/stubs/StubGameEvents';
import { StubRandomService } from './domain/tests/stubs/StubRandomService';
import { SQLAnswerRepository } from './infrastructure/database/repositories/SQLAnswerRepository';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';
import { createTestDatabase } from './infrastructure/database/test-utils';

describe('end-to-end', () => {
  createTestDatabase();

  let gameRepository: SQLGameRepository;
  let playerRepository: SQLPlayerRepository;
  let questionRepository: SQLQuestionRepository;
  let choiceRepository: SQLChoiceRepository;
  let turnRepository: SQLTurnRepository;
  let answerRepository: SQLAnswerRepository;

  let gameEvents: StubGameEvents;
  let randomService: StubRandomService;

  before(() => {
    Container.reset();

    gameRepository = new SQLGameRepository();
    playerRepository = getCustomRepository(SQLPlayerRepository);
    questionRepository = getCustomRepository(SQLQuestionRepository);
    choiceRepository = getCustomRepository(SQLChoiceRepository);
    turnRepository = getCustomRepository(SQLTurnRepository);
    answerRepository = getCustomRepository(SQLAnswerRepository);

    Container.set(GameRepositoryToken, gameRepository);
    Container.set(PlayerRepositoryToken, playerRepository);
    Container.set(QuestionRepositoryToken, questionRepository);
    Container.set(ChoiceRepositoryToken, choiceRepository);
    Container.set(TurnRepositoryToken, turnRepository);
    Container.set(AnswerRepositoryToken, answerRepository);

    gameEvents = new StubGameEvents();
    randomService = new StubRandomService();

    Container.set(GameEventsToken, gameEvents);
    Container.set(RandomServiceToken, randomService);
  });

  beforeEach(async () => {
    await getConnection().query('DELETE FROM game');
    gameEvents.clear();
  });

  const port = 1234;

  before((done) => {
    app.listen(port, done);
  });

  after((done) => {
    app.close(done);
  });

  class StubPlayer {
    private agent = request.agent(app);
    private socket?: Socket;

    constructor(private readonly nick: string) {}

    async authenticate() {
      await this.agent.post('/api/player').send({ nick: this.nick }).expect(201);

      const cookie = this.agent.jar.getCookie('connect.sid', {
        domain: 'localhost',
        path: '/',
        script: false,
        secure: false,
      });

      this.socket = io(`ws://localhost:${port}`, {
        extraHeaders: {
          cookie: [cookie?.name, cookie?.value].join('='),
        },
      });

      await new Promise<void>((resolve) => this.socket?.on('connect', resolve));
    }

    async close() {
      this.socket?.close();
    }

    async emit<Result, Payload = unknown>(message: string, payload?: Payload) {
      return new Promise<Result>((resolve) => {
        this.socket?.emit(message, payload, resolve);
      });
    }
  }

  it('plays a full game', async () => {
    const nils = new StubPlayer('nils');
    await nils.authenticate();

    const tom = new StubPlayer('tom');
    await tom.authenticate();

    const jeanne = new StubPlayer('jeanne');
    await jeanne.authenticate();

    const data = await nils.emit<{ game: { id: number; code: string } }>('createGame');

    await nils.emit('joinGame', { code: data.game.code });
    await tom.emit('joinGame', { code: data.game.code });
    await jeanne.emit('joinGame', { code: data.game.code });

    const { body: game } = await request(app)
      .get('/api/game/' + data.game.id)
      .expect(200);

    expect(game).to.have.property('players').that.is.an('array').of.length(3);

    nils.close();
    tom.close();
    jeanne.close();
  });
});
