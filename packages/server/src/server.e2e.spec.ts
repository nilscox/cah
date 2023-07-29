import { CahClient, ServerFetcher } from '@cah/client';
import {
  AppSelector,
  authenticate,
  choicesSelectors,
  createGame,
  createStore,
  gameSelectors,
  initialize,
  joinGame,
  playerActions,
  playerSelectors,
  questionsSelectors,
  startGame,
  submitAnswer,
} from '@cah/store';

import { StubConfigAdapter, StubExternalDataAdapter, StubLoggerAdapter } from 'src/adapters';
import { createContainer } from 'src/container';
import { Server } from 'src/server/server';
import { TOKENS } from 'src/tokens';

import { defined } from './utils/defined';
import { waitFor } from './utils/wait-for';

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

  createClient() {
    const fetcher = new ServerFetcher(`http://${this.server.address}`);
    const client = new CahClient(fetcher);
    const store = createStore({ client });

    return store;
  }
}

class Player {
  private fetcher: ServerFetcher;
  private client: CahClient;
  private store: ReturnType<typeof createStore>;

  constructor(
    server: Server,
    public readonly nick: string,
  ) {
    this.fetcher = new ServerFetcher(`http://${server.address}`);
    this.client = new CahClient(this.fetcher);
    this.store = createStore({ client: this.client });
  }

  get dispatch() {
    return this.store.dispatch;
  }

  select<Params extends unknown[], Result>(selector: AppSelector<Params, Result>, ...params: Params) {
    return selector(this.store.getState(), ...params);
  }

  get id() {
    return defined(this.select(playerSelectors.player)?.id);
  }

  get hasAllCards() {
    return this.select(choicesSelectors.all).length === 11;
  }

  get isQuestionMaster() {
    return this.select(gameSelectors.isQuestionMaster, this.id);
  }

  get hasAnswers() {
    return this.select(gameSelectors.startedGame).answersIds.length > 0;
  }

  async submitRandomAnswer() {
    const { questionId } = this.select(gameSelectors.startedGame);
    const expectedNumberOfChoices = this.select(questionsSelectors.expectedNumberOfChoices, questionId);
    const choices = this.select(choicesSelectors.all).sort(() => Math.random() - 0.5);

    for (const choice of choices.slice(0, expectedNumberOfChoices)) {
      this.dispatch(playerActions.toggleChoice(choice.id));
    }

    await this.dispatch(submitAnswer());
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
    await test.server.close();
    await test.database.closeConnection();
  });

  // cspell:word riri fifi loulou

  it('plays a full game', async () => {
    const numberOfQuestions = 3;

    const riri = new Player(test.server, 'riri');
    const fifi = new Player(test.server, 'fifi');
    const loulou = new Player(test.server, 'loulou');

    const players = [riri, fifi, loulou];

    const forEachPlayer = async (cb: (player: Player) => unknown) => {
      await Promise.all(players.map(cb));
    };

    await forEachPlayer((player) => player.dispatch(initialize()));
    await forEachPlayer((player) => player.dispatch(authenticate(player.nick)));

    await riri.dispatch(createGame());

    await fifi.dispatch(joinGame(riri.select(gameSelectors.code)));
    await loulou.dispatch(joinGame(riri.select(gameSelectors.code)));

    await riri.dispatch(startGame(numberOfQuestions));

    await waitFor(() => forEachPlayer((player) => assert(player.hasAllCards)));

    await forEachPlayer(async (player) => {
      if (!player.isQuestionMaster) {
        await player.submitRandomAnswer();
      }
    });

    await waitFor(() => forEachPlayer((player) => assert(player.hasAnswers)));

    console.dir(
      riri.select((state) => state),
      { depth: null },
    );

    await new Promise((r) => setTimeout(r, 100));

    /*

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

    */
  });
});
