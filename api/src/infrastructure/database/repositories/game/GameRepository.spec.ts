import { expect } from 'chai';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { GameState, PlayState } from '../../../../../../shared/enums';
import { GameRepository } from '../../../../application/interfaces/GameRepository';
import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { Answer } from '../../../../domain/models/Answer';
import { createChoice, createChoices } from '../../../../domain/models/Choice';
import { Game } from '../../../../domain/models/Game';
import { Player } from '../../../../domain/models/Player';
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

  describe('findAvailableChoices', () => {
    it('finds all the choices', async () => {
      const game = new Game();
      await repository.save(game);

      const choice = createChoice();
      await repository.addChoices(game.id, [choice]);

      const choices = await repository.findAvailableChoices(game.id);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice.id);
    });

    it("excludes the choices that are in a players's hands", async () => {
      const choices = createChoices(2);
      const game = new Game();
      const player = new Player('player');

      game.addPlayer(player);
      await repository.save(game);
      await repository.addChoices(game.id, choices);

      player.addCards([choices[0]]);
      await playerRepository.save(player);

      const availablehoices = await repository.findAvailableChoices(game.id);

      expect(availablehoices).to.have.length(1);
      expect(availablehoices[0]?.id).to.eql(choices[1].id);
    });

    it('excludes the choices that are part of an answer for the current turn', async () => {
      const choices = createChoices(2);
      const question = createQuestion();

      const game = new Game();
      const player = new Player('player');
      const answer = new Answer(player, question, [choices[0]]);

      game.players = [player];

      await playerRepository.save(player);
      await repository.save(game);
      await repository.addQuestions(game.id, [question]);
      await repository.addChoices(game.id, choices);

      game.state = GameState.started;
      game.playState = PlayState.endOfTurn;
      game.questionMaster = player;
      game.question = question;
      game.answers = [answer];
      game.winner = player;

      await repository.save(game);

      const availablehoices = await repository.findAvailableChoices(game.id);

      expect(availablehoices).to.have.length(1);
      expect(availablehoices[0]?.id).to.eql(choices[1].id);
    });

    it('excludes the choices that were part of an answer for a previous turn', async () => {
      const choices = createChoices(2);
      const question = createQuestion();

      const game = new Game();
      const player = new Player('player');
      const answer = new Answer(player, question, [choices[0]]);

      game.players = [player];

      await playerRepository.save(player);
      await repository.save(game);
      await repository.addQuestions(game.id, [question]);
      await repository.addChoices(game.id, choices);

      game.state = GameState.started;
      game.playState = PlayState.endOfTurn;
      game.questionMaster = player;
      game.question = question;
      game.answers = [answer];
      game.winner = player;

      await repository.save(game);
      await repository.addTurn(game.id, game.currentTurn);

      game.answers = [];
      await repository.save(game);

      const availableChoices = await repository.findAvailableChoices(game.id);

      expect(availableChoices).to.have.length(1);
      expect(availableChoices[0]?.id).to.eql(choices[1].id);
    });

    it('resolves an empty array when there is no more choice', async () => {
      const game = new Game();

      await repository.save(game);

      const availableChoices = await repository.findAvailableChoices(game.id);

      expect(availableChoices).to.have.length(0);
    });
  });
};

describe('InMemoryGameRepository', () => {
  specs(
    () => new InMemoryGameRepository(),
    () => new InMemoryPlayerRepository(),
  );
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
