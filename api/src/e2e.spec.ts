import path from 'path';

import { expect } from 'chai';
import { io, Socket } from 'socket.io-client';
import request from 'supertest';
import { Connection } from 'typeorm';

import { ConfigurationVariable } from './application/interfaces/ConfigService';
import { createTypeormConnection, instanciateDependencies } from './infrastructure';
import { createRoutes } from './infrastructure/web';
import { WebServer } from './infrastructure/web/web';
import { AnonymousAnswerDto, AnswerDto, ChoiceDto, QuestionDto } from './shared/dtos';
import { EventDto } from './shared/events';

const port = 1222;
const log = false;
const inMemory = false;
const dbFile = ':memory:';
const dbLogs = false;

const randInt = (min: number, max: number) => ~~(Math.random() * (max - min + 1)) + min;

class StubPlayer {
  public agent: request.SuperAgentTest;
  public socket?: Socket;

  public gameId?: string;
  public playerId?: string;

  public gameState: 'idle' | 'started' | 'finished' = 'idle';
  public playState?: 'playersAnswer' | 'questionMasterSelection' | 'endOfTurn';

  public cards: ChoiceDto[] = [];
  public questionMaster?: string;
  public question?: QuestionDto;

  public answers: Array<AnonymousAnswerDto | AnswerDto> = [];
  public winner?: string;

  public events: EventDto[] = [];

  get isQuestionMaster() {
    return this.questionMaster === this.nick;
  }

  constructor(server: WebServer, public nick: string) {
    this.agent = request.agent(server.httpServer);
  }

  close() {
    this.socket?.close();
  }

  private log(message: string) {
    if (log) {
      console.log(`* ${this.nick} ${message}`);
    }
  }

  private logEvent(type: string) {
    if (log && this.nick === 'nils') {
      console.log(`* event: ${type}`);
    }
  }

  private handleEvent(event: EventDto) {
    this.logEvent(event.type);

    switch (event.type) {
      case 'GameJoined':
      case 'GameLeft':
      case 'PlayerAnswered':
        break;

      case 'GameStarted':
        this.gameState = 'started';
        this.playState = 'playersAnswer';
        break;

      case 'GameFinished':
        this.gameState = 'finished';
        this.playState = undefined;
        break;

      case 'TurnStarted':
        this.questionMaster = event.questionMaster;
        this.question = event.question;
        break;

      case 'TurnFinished':
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
        throw new Error('Unknown event received: ' + JSON.stringify(event));
    }

    this.events.push(event);
  }

  async authenticate() {
    const { body: player } = await this.agent.post('/login').send({ nick: this.nick }).expect(201);

    this.playerId = player.id;

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

  async createGame() {
    this.log('creates a game');

    const { body: game } = await this.agent.post('/game').expect(201);

    this.gameId = game.id;

    return game;
  }

  async joinGame(gameId: string) {
    this.log(`joins the game ${gameId}`);

    await this.agent.post(`/game/${gameId}/join`).expect(200);
    this.gameId = gameId;
  }

  async leaveGame() {
    this.log('leaves the game');

    await this.agent.post(`/game/leave`).expect(204);
  }

  async startGame(questionMaster: StubPlayer, turns: number) {
    this.log(`starts the game, with ${turns} turns and ${questionMaster.nick} as first question master`);

    await this.agent.post(`/start`).send({ questionMasterId: questionMaster.playerId, turns }).expect(200);
  }

  async giveRandomChoicesSelection() {
    const selection = [];

    for (let i = 0; i < this.question!.numberOfBlanks; ++i) {
      if (this.cards.length === 0) {
        throw new Error('player has no more cards');
      }

      selection.push(...this.cards.splice(randInt(0, this.cards.length - 1), 1));
    }

    if (selection.length !== this.question?.numberOfBlanks) {
      throw new Error('not enough cards to create a selection');
    }

    this.log(`answers "${selection.map(({ text }) => text).join(', ')}"`);

    await this.agent
      .post(`/answer`)
      .send({ choicesIds: selection.map((choice) => choice.id) })
      .expect(200);
  }

  async pickRandomAnswer() {
    const answerIndex = randInt(0, this.answers.length - 1);
    const answer = this.answers[answerIndex];

    if (!answer) {
      throw new Error('no answer to pick');
    }

    this.log(`randomly picks "${answer.formatted}"`);

    await this.agent.post(`/select`).send({ answerId: answer.id }).expect(200);
  }

  async flushCards() {
    this.log('flushes his cards');

    this.cards = [];

    await this.agent.post('/flush-cards').send().expect(204);
  }

  async endCurrentTurn() {
    this.log(`ends the current turn`);

    await this.agent.post(`/next`).expect(200);
  }
}

const config = new Map<ConfigurationVariable, string>();

config.set('LISTEN_PORT', String(port));

config.set('LOG_LEVEL', log ? 'info' : 'error');

config.set('DB_FILE', inMemory ? '' : dbFile);
config.set('DB_LOGS', String(dbLogs));

config.set('SESSION_STORE_DB', 'true');
config.set('SESSION_SECRET', 'yolo');

config.set('DATA_DIR', path.resolve(__dirname, '..', 'data'));

describe('e2e', () => {
  let connection: Connection | undefined;
  let server: WebServer;

  const nicks = ['nils', 'tom', 'jeanne', 'vio'] as const;
  const players: StubPlayer[] = [];
  let [nils, tom, jeanne]: StubPlayer[] = [];

  before(async () => {
    connection = await createTypeormConnection(config, {
      synchronize: true,
      dropSchema: true,
    });

    server = new WebServer();

    const deps = await instanciateDependencies({
      configService: config,
      websocketServer: server.websocketServer,
      connection,
    });

    server.init(deps.configService);
    server.register(createRoutes(deps));

    // required for websockets
    await server.listen(config, deps.logger());
  });

  before(() => {
    for (const nick of nicks) {
      players.push(new StubPlayer(server, nick));
    }

    [nils, tom, jeanne] = players;
  });

  after(() => {
    for (const player of players) {
      player.close();
    }
  });

  after(async () => {
    await server?.close();
    await connection?.close();
  });

  const questionMaster = () => {
    return players.find((player) => player.isQuestionMaster);
  };

  const playersExcludingQM = () => {
    return players.filter((player) => !player.isQuestionMaster);
  };

  it('plays a full game', async function () {
    if (!process.env.E2E) {
      this.skip();
    }

    this.slow(inMemory ? 500 : 3000);
    this.timeout(inMemory ? 2000 : 6000);

    for (const player of players) {
      await player.authenticate();
    }

    const game = await nils.createGame();

    for (const player of players.slice(1)) {
      await player.joinGame(game.code);
    }

    await tom.startGame(jeanne, 8);

    expect(questionMaster()).to.eq(jeanne, 'the question master should be jeanne');

    let turn = 1;

    while (questionMaster()) {
      if (log) {
        console.log(`\nturn #${turn}\n`);
      }

      if (turn === 3) {
        await tom.flushCards();
      }

      for (const player of playersExcludingQM()) {
        await player.giveRandomChoicesSelection();
      }

      await questionMaster()?.pickRandomAnswer();
      await questionMaster()?.endCurrentTurn();

      turn++;
    }

    // console.log({ nils, tom, jeanne });
    // console.log((await nils.agent.get('/game/' + nils.gameId + '/turns').expect(200)).body);

    for (const player of players) {
      await player.leaveGame();
    }
  });
});
