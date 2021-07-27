import { Server } from 'http';
import path from 'path';

import { Knex } from 'knex';
import { io, Socket } from 'socket.io-client';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Choice } from './domain/models/Choice';
import { createKnexConnection, createKnexSessionStore, main } from './infrastructure';
import { AnswerEntity } from './infrastructure/database/entities/AnswerEntity';
import { ChoiceEntity } from './infrastructure/database/entities/ChoiceEntity';
import { GameEntity } from './infrastructure/database/entities/GameEntity';
import { PlayerEntity } from './infrastructure/database/entities/PlayerEntity';
import { QuestionEntity } from './infrastructure/database/entities/QuestionEntity';
import { TurnEntity } from './infrastructure/database/entities/TurnEntity';
import { bootstrapServer } from './infrastructure/web';
import { WebsocketServer } from './infrastructure/web/websocket';

const port = 1222;
const log = false;

const debug = false;
const keepDatabase = debug;
const logging = debug;

const inMemory = false;

const randInt = (min: number, max: number) => ~~(Math.random() * (max - min + 1)) + min;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WSEvent = Record<string, any>;

class StubPlayer {
  public agent: request.SuperAgentTest;
  public socket?: Socket;

  public gameId?: string;
  public playerId?: string;

  public gameState: 'idle' | 'started' | 'finished' = 'idle';
  public playState?: 'playersAnswer' | 'questionMasterSelection' | 'endOfTurn';

  public cards: Choice[] = [];
  public questionMaster?: string;
  public question?: { text: string; numberOfBlanks: number; formatted: string };

  public answers: { id: number; choices: { text: string }[]; formatted: string; player?: string }[] = [];
  public winner?: string;

  public events: WSEvent[] = [];

  get isQuestionMaster() {
    return this.questionMaster === this.nick;
  }

  constructor(server: Server, public nick: string) {
    this.agent = request.agent(server);
  }

  close() {
    this.socket?.close();
  }

  private log(message: string) {
    if (log) {
      console.log(`${this.nick} ${message}`);
    }
  }

  private logEvent(type: string) {
    if (log && this.nick === 'nils') {
      console.log(`event: ${type}`);
    }
  }

  private handleEvent(event: WSEvent) {
    this.logEvent(event.type);

    switch (event.type) {
      case 'GameJoined':
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
        throw new Error('Unknown event recieved: ' + JSON.stringify(event));
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

    return game;
  }

  async joinGame(gameId: string) {
    this.log(`joins the game ${gameId}`);

    await this.agent.post(`/game/${gameId}/join`).expect(200);
    this.gameId = gameId;
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

  async endCurrentTurn() {
    this.log(`ends the current turn`);

    await this.agent.post(`/next`).expect(200);
  }
}

describe('e2e', () => {
  let connection: Connection;
  let knex: Knex;
  let server: Server;

  const nicks = ['nils', 'tom', 'jeanne', 'vio'] as const;
  const players: StubPlayer[] = [];
  let [nils, tom, jeanne]: StubPlayer[] = [];

  before(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: keepDatabase ? './db.sqlite' : ':memory:',
      entities: [PlayerEntity, GameEntity, QuestionEntity, ChoiceEntity, AnswerEntity, TurnEntity],
      synchronize: true,
      logging,
      namingStrategy: new SnakeNamingStrategy(),
    });

    knex = createKnexConnection();
  });

  before(async () => {
    const deps = await main({
      connection: inMemory ? undefined : connection,
      dataDir: path.resolve(__dirname, '..', 'data'),
    });

    const sessionStore = await createKnexSessionStore(knex);

    server = bootstrapServer(deps, new WebsocketServer(), sessionStore);

    // required for websockets
    await new Promise<void>((resolve) => server.listen(port, resolve));
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

  after((done) => {
    server?.close(done) ?? done();
  });

  after(async () => {
    await knex.destroy();
    await connection?.close();
  });

  const questionMaster = () => {
    return players.find((player) => player.isQuestionMaster);
  };

  const playersExcludingQM = () => {
    return players.filter((player) => !player.isQuestionMaster);
  };

  it('plays a full game', async function () {
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

    let turn = 1;

    while (questionMaster()) {
      if (log) {
        console.log(`\nturn #${turn++}\n`);
      }

      for (const player of playersExcludingQM()) {
        await player.giveRandomChoicesSelection();
      }

      await questionMaster()?.pickRandomAnswer();
      await questionMaster()?.endCurrentTurn();
    }

    // console.log({ nils, tom, jeanne });
  });
});
