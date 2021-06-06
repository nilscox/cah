import { expect } from 'chai';
import { io, Socket } from 'socket.io-client';
import request from 'supertest';
import { Container } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { app, wsServer } from './application';
import { AnswerRepositoryToken } from './domain/interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from './domain/interfaces/ChoiceRepository';
import { GameEvent, GameEventsToken, PlayerEvent } from './domain/interfaces/GameEvents';
import { GameRepositoryToken } from './domain/interfaces/GameRepository';
import { PlayerRepositoryToken } from './domain/interfaces/PlayerRepository';
import { QuestionRepositoryToken } from './domain/interfaces/QuestionRepository';
import { TurnRepositoryToken } from './domain/interfaces/TurnRepository';
import { RandomServiceToken } from './domain/services/RandomService';
import { StubRandomService } from './domain/tests/stubs/StubRandomService';
import { SQLAnswerRepository } from './infrastructure/database/repositories/SQLAnswerRepository';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';
import { createTestDatabase } from './infrastructure/database/test-utils';

const port = 1234;

class WSError extends Error {
  constructor(public readonly response: unknown) {
    super('Websocket error\n' + JSON.stringify(response, null, 2));
  }
}

class StubPlayer {
  private agent = request.agent(app);
  private socket?: Socket;

  public readonly events: (GameEvent | PlayerEvent)[] = [];

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

    this.socket.on('message', (event) => this.events.push(event));
  }

  close() {
    this.socket?.close();
  }

  async emit<Result, Payload = unknown>(message: string, payload?: Payload) {
    return new Promise<Result>((resolve, reject) => {
      this.socket?.emit(message, payload, (response: { status: 'ok' | 'ko' } & any) => {
        if (response.status === 'ok') {
          resolve(response);
        } else {
          reject(new WSError(response));
        }
      });
    });
  }
}

describe.only('end-to-end', () => {
  createTestDatabase();

  let gameRepository: SQLGameRepository;
  let playerRepository: SQLPlayerRepository;
  let questionRepository: SQLQuestionRepository;
  let choiceRepository: SQLChoiceRepository;
  let turnRepository: SQLTurnRepository;
  let answerRepository: SQLAnswerRepository;

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

    randomService = new StubRandomService();

    Container.set(GameEventsToken, wsServer);
    Container.set(RandomServiceToken, randomService);
  });

  before((done) => {
    app.listen(port, done);
  });

  after(() => {
    nils.close();
    tom.close();
    jeanne.close();
  });

  after((done) => {
    app.close(done);
  });

  const nils = new StubPlayer('nils');
  const tom = new StubPlayer('tom');
  const jeanne = new StubPlayer('jeanne');

  before(async () => {
    await nils.authenticate();
    await tom.authenticate();
    await jeanne.authenticate();
  });

  it('plays a full game', async () => {
    const data = await nils.emit<{ game: { id: number; code: string } }>('createGame');

    await nils.emit('joinGame', { code: data.game.code });
    await tom.emit('joinGame', { code: data.game.code });
    await jeanne.emit('joinGame', { code: data.game.code });

    const { body: game } = await request(app)
      .get('/api/game/' + data.game.id)
      .expect(200);

    expect(game).to.have.property('players').that.is.an('array').of.length(3);

    await nils.emit('startGame');

    console.log(tom.events);
  });
});
