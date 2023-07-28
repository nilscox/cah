import assert from 'node:assert';

import { CahClient, ServerFetcher } from '@cah/client';
import * as shared from '@cah/shared';

import { StubConfigAdapter, StubExternalDataAdapter, StubLoggerAdapter } from 'src/adapters';
import { createContainer } from 'src/container';
import { Server } from 'src/server/server';
import { TOKENS } from 'src/tokens';

import { hasId } from './utils/id';
import { waitFor } from './utils/wait-for';

class Client {
  private cah: CahClient;
  private nick: string;

  public player?: shared.Player;
  public game?: shared.Game;

  public debug = false;
  public debugEvents = false;

  constructor(nick: string, server: Server) {
    this.cah = new CahClient(new ServerFetcher(`http://${server.address}`));
    this.nick = nick;
    this.registerEventsListeners();
  }

  async connect() {
    await this.cah.connect();
  }

  async disconnect() {
    await this.cah.disconnect();
  }

  private log(...args: unknown[]) {
    if (this.debug) {
      console.log(`* ${this.nick}`, ...args);
    }
  }

  private logEvent(event: shared.GameEvent) {
    if (this.debugEvents) {
      console.log(`* received event`, event);
    }
  }

  private registerEventsListeners = () => {
    this.cah.addEventListener('player-joined', (event) => {
      this.logEvent(event);

      if (this.game) {
        this.game.players.push({ id: event.playerId, nick: event.nick });
      }
    });

    this.cah.addEventListener('player-left', (event) => {
      this.logEvent(event);

      assert(this.game);
      this.game.players.splice(this.game.players.findIndex(hasId(event.playerId)), 1);
    });

    this.cah.addEventListener('game-started', (event) => {
      this.logEvent(event);

      assert(this.game);
      this.game.state = shared.GameState.started;

      assert(this.player);
      this.player.cards = [];
    });

    this.cah.addEventListener('turn-started', (event) => {
      this.logEvent(event);

      assert(shared.isStarted(this.game));
      this.game.questionMasterId = event.questionMasterId;
      this.game.question = event.question;
    });

    this.cah.addEventListener('cards-dealt', (event) => {
      this.logEvent(event);

      assert(this.player?.cards);
      this.player.cards.push(...event.cards);
    });

    this.cah.addEventListener('player-answered', (event) => {
      this.logEvent(event);
    });

    this.cah.addEventListener('all-players-answered', (event) => {
      this.logEvent(event);

      assert(shared.isStarted(this.game));
      this.game.answers = event.answers;
    });

    this.cah.addEventListener('winning-answer-selected', (event) => {
      this.logEvent(event);

      assert(shared.isStarted(this.game));
      this.game.selectedAnswerId = event.selectedAnswerId;
      this.game.answers = event.answers;
    });

    this.cah.addEventListener('turn-ended', (event) => {
      this.logEvent(event);

      assert(shared.isStarted(this.game));
      this.game.answers = [];
    });

    this.cah.addEventListener('game-ended', (event) => {
      this.logEvent(event);

      assert(shared.isStarted(this.game));
      this.game.state = shared.GameState.finished;

      const game = this.game as Partial<shared.StartedGame>;
      delete game.questionMasterId;
      delete game.question;
      delete game.answers;
      delete game.selectedAnswerId;

      assert(this.player);
      delete this.player.cards;
    });
  };

  get questionMaster() {
    if (shared.isStarted(this.game)) {
      return this.game.players.find(hasId(this.game.questionMasterId));
    }
  }

  get question() {
    if (shared.isStarted(this.game)) {
      return this.game.question;
    }
  }

  get id() {
    return this.player?.id;
  }

  get cards() {
    return this.player?.cards;
  }

  async authenticate() {
    this.log('authenticates');
    await this.cah.authenticate(this.nick);
  }

  async fetchPlayer() {
    this.log('retrieves themselves');
    this.player = await this.cah.getAuthenticatedPlayer();

    return this.player;
  }

  async fetchGame() {
    const player = await this.fetchPlayer();
    assert(player?.gameId);

    this.log('retrieves their game');
    this.game = await this.cah.getGame(player.gameId);

    return this.game;
  }

  async createGame() {
    this.log('creates a game');
    await this.cah.createGame();
  }

  async joinGame(code: string) {
    this.log(`joins the game ${code}`);
    await this.cah.joinGame(code);
  }

  async startGame(numberOfQuestions: number) {
    this.log('start the game');
    await this.cah.startGame(numberOfQuestions);
  }

  async answer() {
    assert(this.cards);

    const choices = this.cards.slice(0, this.question?.blanks?.length ?? 1);

    this.log('answers the current question:', choices.map((choice) => choice.text).join(', '));
    await this.cah.createAnswer(choices);

    this.cards.splice(0, choices.length);
  }

  async selectAnswer() {
    assert(shared.isStarted(this.game));
    assert(this.game.answers);

    const [answer] = this.game.answers;

    this.log('selects answer:', answer.id);
    await this.cah.selectAnswer(answer);
  }

  async endTurn() {
    this.log('ends the current turn');
    await this.cah.endTurn();
  }

  async leaveGame() {
    this.log('leaves the current game');
    await this.cah.leaveGame();
  }
}

class Test {
  private container = createContainer();

  config = new StubConfigAdapter({
    server: { host: 'localhost', port: 0 },
    database: { url: process.env.DATABASE_URL ?? 'postgres://postgres@localhost:5432/cah', debug: true },
  });

  logger = new StubLoggerAdapter();
  externalData = new StubExternalDataAdapter();

  constructor() {
    const container = this.container;

    container.bindValue(TOKENS.config, this.config);
    container.bindValue(TOKENS.logger, this.logger);
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

    await test.database.closeConnection();
  });

  // cspell:word riri fifi loulou

  it('plays a full game', async () => {
    const numberOfQuestions = 3;

    const riri = test.createClient('riri');
    const fifi = test.createClient('fifi');
    const loulou = test.createClient('loulou');

    const players = [riri, fifi, loulou];

    const forEachPlayer = async (cb: (player: Client) => void | Promise<void>) => {
      await Promise.all(players.map(cb));
    };

    await forEachPlayer(async (player) => {
      // player.debug = true;
      // player.debugEvents = true;
      await player.authenticate();
      await player.connect();
    });

    await riri.createGame();
    const { code } = await waitFor(() => riri.fetchGame());

    await fifi.joinGame(code);
    await fifi.fetchGame();

    await loulou.joinGame(code);
    await loulou.fetchGame();

    await riri.startGame(numberOfQuestions);

    await waitFor(() => forEachPlayer((player) => assert(player.cards?.length)));

    const hasAllAnswers = (questionMaster: Client) => {
      return shared.isStarted(questionMaster.game) && questionMaster.game.answers?.length === 2;
    };

    const getQuestionMaster = () => {
      return players.find((player) => player.id === riri.questionMaster?.id);
    };

    for (let turn = 1; turn <= numberOfQuestions; ++turn) {
      const questionMaster = getQuestionMaster();
      assert(questionMaster);

      await forEachPlayer(async (player) => {
        if (player !== questionMaster) {
          await player.answer();
        }
      });

      await waitFor(() => assert(hasAllAnswers(questionMaster)));

      await questionMaster.selectAnswer();
      await questionMaster.endTurn();

      await waitFor(() => assert(getQuestionMaster() !== questionMaster));
    }

    expect(riri.game?.state).toBe(shared.GameState.finished);

    await forEachPlayer(async (player) => {
      await player.leaveGame();
      await player.disconnect();
    });
  });
});
