import { expect } from 'chai';
import _ from 'lodash';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { GameState, PlayState } from '../../../../../../shared/enums';
import { GameRepository } from '../../../../application/interfaces/GameRepository';
import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { createChoice } from '../../../../domain/models/Choice';
import { Game } from '../../../../domain/models/Game';
import { createQuestion, createQuestions } from '../../../../domain/models/Question';
import { GameBuilder } from '../../../../utils/GameBuilder';
import { StubExternalData } from '../../../stubs/StubExternalData';
import { entities } from '../../entities';
import { InMemoryPlayerRepository } from '../player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from '../player/SQLPlayerRepository';

import { InMemoryGameRepository } from './InMemoryGameRepository';
import { SQLGameRepository } from './SQLGameRepository';

const debug = false;
const keepDatabase = debug;
const logging = debug;

const specs = (getRepository: () => GameRepository, getPlayerRepository: () => PlayerRepository) => {
  let repository: GameRepository;
  let playerRepository: PlayerRepository;
  let externalData: StubExternalData;

  let builder: GameBuilder;

  beforeEach(() => {
    repository = getRepository();
    playerRepository = getPlayerRepository();
    externalData = new StubExternalData();

    builder = new GameBuilder(repository, playerRepository, externalData);
  });

  it('finds all games', async () => {
    expect(await repository.findAll()).to.eql([]);

    const game = new Game();
    await repository.save(game);

    expect(await repository.findAll()).to.shallowDeepEqual([{ id: game.id }]);
  });

  it('finds a game from its id', async () => {
    expect(await repository.findGameById('')).to.be.undefined;

    const game = new Game();
    await repository.save(game);

    const savedGame = await repository.findGameById(game.id);

    expect(savedGame).to.have.property('id', game.id);
    expect(savedGame).to.have.property('code', game.code);
    expect(savedGame).to.have.property('state', GameState.idle);
  });

  it('finds a started game from its id', async () => {
    expect(await repository.findGameById('')).to.be.undefined;

    const game = await builder.addPlayers(3).start(4).play(PlayState.endOfTurn).get();

    const savedGame = await repository.findGameById(game.id);

    if (!savedGame?.isStarted()) {
      throw null;
    }

    expect(savedGame).to.have.property('id', game.id);
    expect(savedGame).to.have.property('code', game.code);
    expect(savedGame).to.have.property('state', GameState.started);
    expect(savedGame).to.have.property('playState', PlayState.endOfTurn);
    expect(savedGame).to.have.nested.property('questionMaster.id', game.questionMaster.id);
    expect(savedGame).to.have.nested.property('question.id', game.question.id);
    expect(savedGame).to.have.nested.property('answers').that.have.length(2);
    expect(savedGame).to.have.nested.property('winner.id', game.winner!.id);
  });

  it("finds a game from a player's id", async () => {
    expect(await repository.findGameForPlayer('')).to.be.undefined;

    const game = await builder.addPlayers().start().get();
    const player = game.players[0];

    const savedGame = await repository.findGameForPlayer(player.id);

    expect(savedGame).to.have.property('id', game.id);
    expect(savedGame).to.have.nested.property('players[0].id', player.id);
  });

  describe('findNextAvailableQuestion', () => {
    it('finds the first question', async () => {
      const question = await createQuestion();
      externalData.setRandomQuestions([question]);

      const game = new Game();

      await repository.save(game);
      await repository.addQuestions(game.id, [question]);

      const nextQuestion = await repository.findNextAvailableQuestion(game.id);

      expect(nextQuestion?.id).to.eql(question.id);
    });

    it('finds the first question that is not the current question', async () => {
      const questions = await createQuestions(2);
      externalData.setRandomQuestions(questions);

      const game = await builder.addPlayers().start(2).get();

      const nextQuestion = await repository.findNextAvailableQuestion(game.id);

      expect(nextQuestion?.id).to.eql(questions[1].id);
    });

    it('finds the first question that was not already answered', async () => {
      const questions = await createQuestions(3);
      externalData.setRandomQuestions(questions);

      const game = await builder.addPlayers().start(3).play(PlayState.endOfTurn).get();

      await repository.addTurn(game.id, game.currentTurn);

      game.nextTurn(questions[1]);
      await repository.save(game);

      const nextQuestion = await repository.findNextAvailableQuestion(game.id);

      expect(nextQuestion?.id).to.eql(questions[2].id);
    });

    it('resolves undefined when there is no more question', async () => {
      const questions = await createQuestions(1);
      externalData.setRandomQuestions(questions);

      const game = await builder.addPlayers().start(1).play(PlayState.endOfTurn).get();

      await repository.addTurn(game.id, game.currentTurn);

      game.finish();
      await repository.save(game);

      const nextQuestion = await repository.findNextAvailableQuestion(game.id);

      expect(nextQuestion).to.be.undefined;
    });
  });

  describe('choices availability', () => {
    it('finds all the choices', async () => {
      const game = new Game();
      await repository.save(game);

      const choice = createChoice();
      await repository.addChoices(game.id, [choice]);

      const choices = await repository.findAvailableChoices(game.id);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice.id);
    });

    it('excludes unavailable choices', async () => {
      const game = new Game();
      await repository.save(game);

      const choice = createChoice({ available: false });
      await repository.addChoices(game.id, [choice]);

      const choices = await repository.findAvailableChoices(game.id);

      expect(choices).to.have.length(0);
    });

    it('resolves an empty array when there is no more choice', async () => {
      const game = new Game();

      await repository.save(game);

      const availableChoices = await repository.findAvailableChoices(game.id);

      expect(availableChoices).to.have.length(0);
    });

    it('marks choices as unavailable', async () => {
      const game = new Game();
      await repository.save(game);

      const choice = createChoice();
      await repository.addChoices(game.id, [choice]);

      await repository.markChoicesUnavailable([choice.id]);

      expect(await repository.findAvailableChoices(game.id)).to.have.length(0);
    });
  });
};

describe('InMemoryGameRepository', () => {
  specs(
    () => new InMemoryGameRepository(),
    () => new InMemoryPlayerRepository(),
  );

  it('reloads a game', async () => {
    const game = new Game();
    const repo = new InMemoryGameRepository();

    await repo.save(game);

    const other = await repo.findGameById(game.id);

    game.state = GameState.finished;
    await repo.save(game);

    repo.reload(other);

    expect(other!.state).to.eql(GameState.finished);
  });
});

describe('SQLGameRepository', () => {
  let connection: Connection;

  before(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: keepDatabase ? './db.sqlite' : ':memory:',
      entities,
      synchronize: true,
      logging,
      namingStrategy: new SnakeNamingStrategy(),
    });
  });

  after(async () => {
    await connection?.close();
  });

  afterEach(async () => {
    if (!keepDatabase) {
      await connection.synchronize(true);
    }
  });

  specs(
    () => new SQLGameRepository(connection),
    () => new SQLPlayerRepository(connection),
  );
});
