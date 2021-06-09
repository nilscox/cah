import { expect } from 'chai';
import { io, Socket } from 'socket.io-client';
import request from 'supertest';
import { Container } from 'typedi';
import { getCustomRepository } from 'typeorm';

import { app, wsGameEvents } from './application';
import { Choice } from './domain/entities/Choice';
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
  constructor({ stack, ...response }: any) {
    super('Websocket error\n' + JSON.stringify(response, null, 2));

    if (stack) {
      this.message += '\n' + stack;
    }
  }
}

class StubPlayer {
  private agent = request.agent(app);
  private socket?: Socket;

  public gameState: 'idle' | 'started' | 'finished' = 'idle';
  public playState?: 'playersAnswer' | 'questionMasterSelection' | 'endOfTurn';

  public cards: Choice[] = [];
  public questionMaster?: string;
  public question?: { text: string; neededChoices: number };

  public answers: { id: number; choices: { text: string }[]; player?: string }[] = [];
  public winner?: string;

  public events: (GameEvent | PlayerEvent)[] = [];

  get isQuestionMaster() {
    return this.questionMaster === this.nick;
  }

  constructor(public nick: string) {}

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

    this.socket.on('message', (event) => this.handleEvent(event));
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

  private handleEvent(event: any) {
    switch (event.type) {
      case 'PlayerJoined':
      case 'PlayerAnswered':
        break;

      case 'GameStarted':
        this.gameState = 'started';
        this.playState = 'playersAnswer';
        break;

      case 'TurnStarted':
        this.questionMaster = event.questionMaster;
        this.question = event.question;
        break;

      case 'TurnEnded':
        this.questionMaster = undefined;
        this.question = undefined;
        this.answers = [];
        this.winner = undefined;
        break;

      case 'AllPlayersAnswered':
        this.answers = event.answers;
        this.playState = 'questionMasterSelection';
        break;

      case 'WinnerSelected':
        this.answers = event.answers;
        this.winner = event.winner;
        break;

      case 'CardsDealt':
        this.cards.push(...event.cards);
        break;

      default:
        throw new Error('Unknown event recieved: ' + JSON.stringify(event));
    }

    this.events.push(event);
  }

  async joinGame(gameCode: string) {
    await this.emit('joinGame', { code: gameCode });
  }

  async giveRandomChoicesSelection() {
    const selection = [];

    for (let i = 0; i < this.question!.neededChoices && this.cards.length > 0; ++i) {
      selection.push(...this.cards.splice(~~(Math.random() * this.cards.length), 1));
    }

    await this.emit('giveChoicesSelection', {
      choicesIds: selection.map((choice) => choice.id),
    });
  }

  async pickRandomAnswer() {
    const answerIndex = ~~(Math.random() * this.answers.length);

    await this.emit('pickWinningAnswer', {
      answerId: this.answers[answerIndex].id,
    });
  }
}

describe('end-to-end', () => {
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

    Container.set(GameEventsToken, wsGameEvents);
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

    await nils.joinGame(data.game.code);
    await tom.joinGame(data.game.code);
    await jeanne.joinGame(data.game.code);

    const { body: game } = await request(app)
      .get('/api/game/' + data.game.id)
      .expect(200);

    expect(game).to.have.property('players').that.is.an('array').of.length(3);

    await nils.emit('startGame');
    await new Promise((r) => setTimeout(r, 0));

    const expectEqualGameState = async () => {
      await new Promise((r) => setTimeout(r, 0));

      for (const player of [tom, jeanne]) {
        expect(player.gameState).to.eql(nils.gameState);
        expect(player.playState).to.eql(nils.playState);
        expect(player.questionMaster).to.eql(nils.questionMaster);
        expect(player.question).to.eql(nils.question);
        expect(player.answers).to.eql(nils.answers);
      }
    };

    const questionMaster = () => {
      return [nils, tom, jeanne].filter((player) => player.isQuestionMaster)[0];
    };

    const playersExcludingQM = () => {
      return [nils, tom, jeanne].filter((player) => !player.isQuestionMaster);
    };

    await expectEqualGameState();

    for (const player of playersExcludingQM()) {
      await player.giveRandomChoicesSelection();
      await expectEqualGameState();
    }

    await questionMaster().pickRandomAnswer();
    await expectEqualGameState();
  });
});
