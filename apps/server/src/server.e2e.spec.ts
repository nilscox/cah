import { CahClient, ServerFetcher } from '@cah/client';
import {
  AppSelector,
  authenticate,
  createGame,
  createStore,
  endTurn,
  gameActions,
  gameSelectors,
  initialize,
  joinGame,
  playerActions,
  playerSelectors,
  questionsSelectors,
  startGame,
  submitAnswer,
  validateSelectedAnswer,
} from '@cah/store';
import { defined, getIds, waitFor } from '@cah/utils';

import { StubConfigAdapter, StubExternalDataAdapter, StubLoggerAdapter } from 'src/adapters';
import { createContainer } from 'src/container';
import { Server } from 'src/server/server';
import { TOKENS } from 'src/tokens';

const debug = false;

const log = (...args: unknown[]) => {
  if (debug) {
    console.log(...args);
  }
};

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
    return this.select(playerSelectors.cards).length === 11;
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
    const choices = this.select(playerSelectors.cards).sort(() => Math.random() - 0.5);

    for (const choice of choices.slice(0, expectedNumberOfChoices)) {
      this.dispatch(playerActions.toggleChoice(choice.id));
    }

    const selected = this.select(playerSelectors.selectedChoices);
    log(`* ${this.nick} submits [${getIds(selected).join(', ')}]`);

    await this.dispatch(submitAnswer());
  }

  async selectRandomAnswer() {
    const game = this.select(gameSelectors.startedGame);
    const answersIds = [...game.answersIds];
    const answerId = answersIds.sort(() => Math.random() - 0.5)[0];

    log(`* ${this.nick} selects ${answerId}`);

    this.dispatch(gameActions.setSelectedAnswer(answerId));
    await this.dispatch(validateSelectedAnswer());
  }

  async endTurn() {
    log(`* ${this.nick} ends the current turn`);
    this.dispatch(endTurn());
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

  // cspell:word riri fifi loulou phooey

  it('plays a full game', async () => {
    const numberOfQuestions = 5;

    const riri = new Player(test.server, 'riri');
    const fifi = new Player(test.server, 'fifi');
    const loulou = new Player(test.server, 'loulou');
    const phooey = new Player(test.server, 'phooey');

    const players = [riri, fifi, loulou, phooey];

    const forEachPlayer = async (cb: (player: Player) => unknown) => {
      await Promise.all(players.map(cb));
    };

    await forEachPlayer((player) => player.dispatch(initialize()));
    await forEachPlayer((player) => player.dispatch(authenticate(player.nick)));

    await riri.dispatch(createGame());

    await forEachPlayer(async (player) => {
      if (player !== riri) {
        await player.dispatch(joinGame(riri.select(gameSelectors.code)));
      }
    });

    await riri.dispatch(startGame(numberOfQuestions));

    for (let turn = 1; turn <= numberOfQuestions; ++turn) {
      await waitFor(() => forEachPlayer((player) => assert(player.hasAllCards)));

      const questionMaster = defined(players.find((player) => player.isQuestionMaster));

      log(`* turn ${turn} starts, questions master: ${questionMaster.nick}`);

      await forEachPlayer(async (player) => {
        if (player !== questionMaster) {
          await player.submitRandomAnswer();
        }
      });

      await waitFor(() => forEachPlayer((player) => assert(player.hasAnswers)));

      log(`* all players answered:`);
      for (const answer of questionMaster.select(gameSelectors.answers)) {
        log(`* answer ${answer.id}: [${answer.choicesIds.join(', ')}]`);
      }

      await questionMaster.selectRandomAnswer();
      await questionMaster.endTurn();
    }

    await waitFor(() => {
      expect(riri.select(gameSelectors.game)).toHaveProperty('state', 'finished');
    });

    // await forEachPlayer(async (player) => {
    //   await player.leaveGame();
    //   await player.disconnect();
    // });

    if (debug) {
      console.dir(
        riri.select((state) => state),
        { depth: null },
      );
    }
  });
});
