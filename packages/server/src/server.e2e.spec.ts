import assert from 'node:assert';
import { inspect } from 'node:util';

import { Choice, Game, GameEvent, GameState } from '@cah/shared';
import { Socket, io } from 'socket.io-client';

import {
  StubConfigAdapter,
  StubExternalDataAdapter,
  StubLoggerAdapter,
  StubRandomAdapter,
} from 'src/adapters';
import { createContainer } from 'src/container';
import { Player } from 'src/entities';
// eslint-disable-next-line no-restricted-imports
import { Server } from 'src/server/server';
import { TOKENS } from 'src/tokens';
import { defined } from 'src/utils/defined';
import { hasProperty } from 'src/utils/has-property';

import { Fetcher } from './utils/fetcher';
import { getIds } from './utils/id';
import { waitFor } from './utils/wait-for';

class Client {
  private fetcher: Fetcher;
  private socket?: Socket;

  constructor(
    private nick: string,
    private readonly server: Server,
  ) {
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

      case 'winning-answer-selected':
        this.game.selectedAnswerId = event.selectedAnswerId;
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
      `selectedAnswerId: ${this.game.selectedAnswerId ?? '-'}`,
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
  }

  async joinGame(code: string) {
    this.log(`joins the game ${code}`);
    await this.fetcher.put(`/game/${code}/join`);
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

  async selectAnswer() {
    const [answer] = defined(this.game.answers);

    this.log('selects answer:', answer.id);
    await this.fetcher.put(`/game/answer/${answer.id}/select`);
  }
}

class Test {
  private container = createContainer();

  config = new StubConfigAdapter({
    server: { host: 'localhost', port: 0 },
    database: { url: process.env.DATABASE_URL ?? 'postgres://postgres@localhost:5432/cah', debug: true },
  });

  logger = new StubLoggerAdapter();
  random = new StubRandomAdapter();
  externalData = new StubExternalDataAdapter();

  constructor() {
    const container = this.container;

    container.bindValue(TOKENS.config, this.config);
    container.bindValue(TOKENS.logger, this.logger);
    container.bindValue(TOKENS.random, this.random);
    container.bindValue(TOKENS.externalData, this.externalData);
  }

  get server() {
    return this.container.resolve(TOKENS.server);
  }

  get notifier() {
    return this.container.resolve(TOKENS.notifier);
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

    test.notifier.configure();

    await test.database.migrate();
    await test.database.clear();

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
    await waitFor(() => riri.fetchGame());

    await fifi.joinGame(riri.game.code);
    await fifi.fetchGame();

    await loulou.joinGame(riri.game.code);
    await loulou.fetchGame();

    await riri.startGame();

    await forEachPlayer((player) => void player.fetchGame());

    await waitFor(() => forEachPlayer((player) => assert(player.cards.length > 0)));

    await fifi.answer();
    await loulou.answer();

    await waitFor(() => assert(riri.game.answers?.length === 2));

    await riri.selectAnswer();

    // await new Promise((r) => setTimeout(r, 100));
    // console.log(loulou);

    await forEachPlayer((player) => player.disconnect());
  });
});
