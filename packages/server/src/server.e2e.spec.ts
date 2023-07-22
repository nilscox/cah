import assert from 'node:assert';
import { inspect } from 'node:util';

import { Choice, Game, GameEvent, GameState } from '@cah/shared';
import { bindModule, createContainer, injectable, injectableClass } from 'ditox';
import { Socket, io } from 'socket.io-client';

import {
  MathRandomGeneratorAdapter,
  RealEventPublisherAdapter,
  StubConfigAdapter,
  StubExternalDataAdapter,
  StubLoggerAdapter,
  StubRandomAdapter,
} from 'src/adapters';
import { appModule, sqlPersistenceModule } from 'src/container';
import { Player } from 'src/entities';
import { Notifier } from 'src/notifier/notifier';
// eslint-disable-next-line no-restricted-imports
import { Database } from 'src/persistence/database';
import { Server } from 'src/server/server';
import { Fetcher } from 'src/test/fetcher';
import { TOKENS } from 'src/tokens';
import { defined } from 'src/utils/defined';
import { hasProperty } from 'src/utils/has-property';

import { getIds } from './utils/id';
import { waitFor } from './utils/wait-for';

class Client {
  private fetcher: Fetcher;
  private socket?: Socket;

  constructor(private nick: string, private readonly server: Server) {
    this.fetcher = new Fetcher(`http://${this.address}`);
  }

  private get address() {
    return defined(this.server.address);
  }

  async connect() {
    const sessionId = this.fetcher.sessionId;
    assert(sessionId);

    this.socket = io(`ws://${this.address}`, {
      extraHeaders: { cookie: this.fetcher.cookie },
    });

    this.socket.on('message', this.handleEvent);

    await new Promise<void>((resolve) => this.socket?.on('connect', resolve));
  }

  async disconnect() {
    const socket = this.socket;

    assert(socket);

    return new Promise<void>((resolve) => {
      socket.on('disconnect', () => resolve());
      return socket.disconnect();
    });
  }

  public game!: Game;
  public cards: Choice[] = [];
  public playersAnswered: string[] = [];

  public debug = false;
  public debugEvents = false;

  private log(...args: unknown[]) {
    if (this.debug) {
      console.log(`* ${this.nick}`, ...args);
    }
  }

  private handleEvent = (event: GameEvent) => {
    if (this.debugEvents) {
      this.log('received event', event);
    }

    switch (event.type) {
      case 'player-joined':
        this.game?.players.push({ id: event.playerId, nick: event.nick });
        break;

      case 'game-started':
        this.game.state = GameState.started;
        break;

      case 'turn-started':
        this.game.questionMasterId = event.questionMasterId;
        this.game.question = event.question;
        this.playersAnswered = [];
        this.game.answers = [];
        break;

      case 'cards-dealt':
        this.cards.push(...event.cards);
        break;

      case 'player-answered':
        this.playersAnswered.push(event.playerId);
        break;

      case 'all-players-answered':
        this.game.answers = event.answers;
        break;
    }
  };

  get questionMaster() {
    if (this.game.questionMasterId) {
      return this.game.players.find(hasProperty('id', this.game.questionMasterId));
    }
  }

  get question() {
    return this.game.question;
  }

  [inspect.custom]() {
    return [
      this.nick,
      this.nick.replace(/./g, '-'),
      `players: ${this.game.players.map(({ id, nick }) => `${nick} (${id})`).join(', ')}`,
      `gameState: ${this.game.state}`,
      `questionMaster: ${this.questionMaster?.nick ?? '-'}`,
      `question: ${this.question?.text ?? '-'}`,
      `answers: ${
        this.game.answers?.map((answer) => answer.choices?.map((choice) => choice.text)).join(', ') ?? '-'
      }`,
      `cards:`,
      ...this.cards.map((choice) => `- ${choice.text} (${choice.id})`),
    ].join('\n');
  }

  async authenticate() {
    this.log('authenticates');
    await this.fetcher.post('/authenticate', { nick: this.nick });
  }

  async fetchPlayer() {
    this.log('retrieves themselves');
    return this.fetcher.get<Player>('/player');
  }

  async fetchGame() {
    const { gameId } = await this.fetchPlayer();

    this.log('retrieves their game');
    this.game = await this.fetcher.get<Game>(`/game/${defined(gameId)}`);
    return this.game;
  }

  async createGame() {
    this.log('creates a game');
    await this.fetcher.post('/game');
    await this.fetchGame();
  }

  async joinGame(code: string) {
    this.log(`joins the game ${code}`);
    await this.fetcher.put(`/game/${code}/join`);
    await this.fetchGame();
  }

  async startGame() {
    this.log('start the game');
    await this.fetcher.put('/game/start');
  }

  async answer() {
    const choices = this.cards.slice(0, this.question?.blanks?.length ?? 1);

    this.log('answers the current question:', choices.map((choice) => choice.text).join(', '));

    await this.fetcher.post('/game/answer', { choicesIds: getIds(choices) });
    this.cards.splice(0, choices.length);
  }
}

class Test {
  private container = createContainer();

  config = new StubConfigAdapter({
    server: { host: 'localhost', port: 0 },
    database: { url: 'postgres://postgres@localhost:5432/cah' },
  });

  logger = new StubLoggerAdapter();
  random = new StubRandomAdapter();
  generator = new MathRandomGeneratorAdapter();
  externalData = new StubExternalDataAdapter();

  constructor() {
    const container = this.container;

    container.bindValue(TOKENS.container, container);

    container.bindValue(TOKENS.config, this.config);
    container.bindValue(TOKENS.logger, this.logger);
    container.bindValue(TOKENS.random, this.random);
    container.bindValue(TOKENS.generator, this.generator);
    container.bindValue(TOKENS.externalData, this.externalData);

    container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));
    // prettier-ignore
    container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.publisher, TOKENS.container));
    // prettier-ignore
    container.bindFactory(TOKENS.rtc, injectable((server) => server.rtc, TOKENS.server));
    // prettier-ignore
    container.bindFactory(TOKENS.notifier, injectableClass(Notifier, TOKENS.rtc, TOKENS.publisher, TOKENS.repositories.game, TOKENS.repositories.player, TOKENS.repositories.choice, TOKENS.repositories.question, TOKENS.repositories.answer));
    // prettier-ignore
    container.bindFactory(TOKENS.database, Database.inject);

    bindModule(container, sqlPersistenceModule);
    bindModule(container, appModule);

    container.resolve(TOKENS.notifier).configure();
  }

  get server() {
    return this.container.resolve(TOKENS.server);
  }

  get database() {
    return this.container.resolve(TOKENS.database);
  }

  createClient(nick: string) {
    return new Client(nick, this.server);
  }
}

describe('Server E2E', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();

    await test.database.clear('cah');
    await test.server.listen();
  });

  afterEach(async () => {
    if (test?.server.listening) {
      await test.server.close();
    }

    // await test.database.closeConnection();
  });

  // cspell:word riri fifi loulou

  it('plays a full game', async () => {
    const riri = test.createClient('riri');
    const fifi = test.createClient('fifi');
    const loulou = test.createClient('loulou');

    const forEachPlayer = async (cb: (player: Client) => void | Promise<void>) => {
      for (const player of [riri, fifi, loulou]) {
        await cb(player);
      }
    };

    await forEachPlayer(async (player) => {
      // player.debug = true;
      // player.debugEvents = true;
      await player.authenticate();
      await player.connect();
    });

    await riri.createGame();

    await fifi.joinGame(riri.game.code);
    await loulou.joinGame(riri.game.code);

    await riri.startGame();

    await forEachPlayer((player) => void player.fetchGame());

    await waitFor(() => forEachPlayer((player) => assert(player.cards.length > 0)));

    await fifi.answer();
    await loulou.answer();

    // await new Promise((r) => setTimeout(r, 100));
    // console.log(loulou);

    await forEachPlayer((player) => player.disconnect());
  });
});
