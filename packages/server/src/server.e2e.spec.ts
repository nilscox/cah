import assert from 'node:assert';

import { Game, Player } from '@cah/shared';
import { bindModule, createContainer, injectable, injectableClass } from 'ditox';
import { Socket, io } from 'socket.io-client';
import { CookieJar } from 'tough-cookie';

import { RealEventPublisherAdapter, StubConfigAdapter, StubLoggerAdapter } from './adapters';
import { MathRandomGeneratorAdapter } from './adapters/generator/math-random-generator.adapter';
import { appModule, inMemoryPersistenceModule } from './container';
import { Notifier } from './notifier/notifier';
import { Server } from './server/server';
import { TOKENS } from './tokens';
import { defined } from './utils/defined';

class Fetcher {
  private currentUrl = 'http://localhost';
  private jar = new CookieJar();

  constructor(private readonly baseUrl: string) {}

  get cookie() {
    return this.jar.getCookieStringSync(this.currentUrl);
  }

  get sessionId() {
    const cookies = this.jar.getCookiesSync(this.currentUrl);
    const sessionCookie = cookies.find((cookie) => cookie.key === 'connect.sid');

    return sessionCookie?.value;
  }

  async get<Result>(path: string): Promise<Result> {
    return this.request(path);
  }

  post = this.mutate('POST');
  put = this.mutate('PUT');
  delete = this.mutate('DELETE');

  private async request<Result>(path: string, init: RequestInit = {}): Promise<Result> {
    const headers = new Headers(init?.headers);
    init.headers = headers;

    const cookieString = await this.jar.getCookieString(this.currentUrl);
    if (cookieString) headers.set('cookie', cookieString);

    const response = await fetch(this.baseUrl + path, init);
    assert(response.ok, await response.clone().text());

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) await this.jar.setCookie(setCookie, this.currentUrl);

    const contentType = response.headers.get('Content-Type');

    if (contentType?.startsWith('application/json')) {
      return response.json() as Result;
    } else {
      return response.text() as Result;
    }
  }

  private mutate(method: string) {
    return async (path: string, body?: unknown): Promise<void> => {
      const headers = new Headers();
      const init: RequestInit = {
        method,
        headers,
      };

      if (body !== undefined) {
        init.body = JSON.stringify(body);
        headers.set('Content-Type', 'application/json');
      }

      return this.request<void>(path, init);
    };
  }
}

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
    this.log(event);
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
    riri.debug = debug;

    const fifi = test.createClient('fifi');
    fifi.debug = debug;

    const loulou = test.createClient('loulou');
    loulou.debug = debug;

    await riri.authenticate();
    await riri.connect();

    await riri.createGame();

    // await fifi.joinGame(game.id);
    // await loulou.joinGame(game.id);
  });
});
