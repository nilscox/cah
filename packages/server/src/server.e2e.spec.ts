import assert from 'node:assert';

import { bindModule, createContainer, injectable, injectableClass } from 'ditox';
import { Socket, io } from 'socket.io-client';

import {
  RealEventPublisherAdapter,
  StubConfigAdapter,
  StubLoggerAdapter,
  MathRandomGeneratorAdapter,
} from 'src/adapters';
import { appModule, inMemoryPersistenceModule } from 'src/container';
import { Game, Player } from 'src/entities';
import { Notifier } from 'src/notifier/notifier';
import { Server } from 'src/server/server';
import { Fetcher } from 'src/test/fetcher';
import { TOKENS } from 'src/tokens';
import { defined } from 'src/utils/defined';

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

  public debug = false;

  private log(...args: unknown[]) {
    if (this.debug) {
      console.log(`* ${this.nick}`, ...args);
    }
  }

  private handleEvent = (event: unknown) => {
    this.log('received event', event);
  };

  async authenticate() {
    this.log('authenticates');
    await this.fetcher.post('/authenticate', { nick: this.nick });
  }

  async me() {
    this.log('retrieves themselves');
    return this.fetcher.get<Player>('/me');
  }

  async game() {
    const { gameId } = await this.me();

    if (!gameId) {
      return;
    }

    this.log('retrieves their game');
    return this.fetcher.get<Game>(`/game/${gameId}`);
  }

  async createGame() {
    this.log('creates a game');
    await this.fetcher.post('/game');
  }

  async joinGame(code: string) {
    this.log(`joins the game ${code}`);
    await this.fetcher.put(`/game/${code}/join`);
  }
}

class Test {
  private container = createContainer();

  config = new StubConfigAdapter({ server: { host: 'localhost', port: 0 } });
  logger = new StubLoggerAdapter();
  generator = new MathRandomGeneratorAdapter();

  constructor() {
    const container = this.container;

    container.bindValue(TOKENS.container, container);

    container.bindValue(TOKENS.config, this.config);
    container.bindValue(TOKENS.logger, this.logger);
    container.bindValue(TOKENS.generator, this.generator);

    container.bindFactory(TOKENS.publisher, injectableClass(RealEventPublisherAdapter, TOKENS.logger));
    // prettier-ignore
    container.bindFactory(TOKENS.server, injectableClass(Server, TOKENS.config, TOKENS.logger, TOKENS.publisher, TOKENS.container));
    // prettier-ignore
    container.bindFactory(TOKENS.rtc, injectable((server) => server.rtc, TOKENS.server));
    // prettier-ignore
    container.bindFactory(TOKENS.notifier, injectableClass(Notifier, TOKENS.rtc, TOKENS.publisher, TOKENS.repositories.game, TOKENS.repositories.player));

    bindModule(container, inMemoryPersistenceModule);
    bindModule(container, appModule);

    container.resolve(TOKENS.notifier).configure();
  }

  get server() {
    return this.container.resolve(TOKENS.server);
  }

  createClient(nick: string) {
    return new Client(nick, this.server);
  }
}

describe('Server E2E', () => {
  let test: Test;

  beforeEach(async () => {
    test = new Test();
    await test.server.listen();
  });

  afterEach(async () => {
    if (test.server.listening) {
      await test.server.close();
    }
  });

  // cspell:word riri fifi loulou

  it('plays a full game', async () => {
    const debug = false;
    // const debug = true;

    const riri = test.createClient('riri');
    const fifi = test.createClient('fifi');
    const loulou = test.createClient('loulou');

    const forEachPlayer = async (cb: (player: Client) => Promise<void>) => {
      for (const player of [riri, fifi, loulou]) {
        await cb(player);
      }
    };

    await forEachPlayer(async (player) => {
      player.debug = debug;
      await player.authenticate();
      await player.connect();
    });

    await riri.createGame();
    const game = defined(await riri.game());

    await fifi.joinGame(game.code);
    await loulou.joinGame(game.code);
  });
});
