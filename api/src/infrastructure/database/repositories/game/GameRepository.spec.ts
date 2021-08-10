import { expect } from 'chai';
import { Connection, Repository } from 'typeorm';

import { GameState, PlayState } from '../../../../../../shared/enums';
import { GameRepository } from '../../../../application/interfaces/GameRepository';
import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { Blank } from '../../../../domain/models/Blank';
import { createChoice } from '../../../../domain/models/Choice';
import { createGame } from '../../../../domain/models/Game';
import { Player } from '../../../../domain/models/Player';
import { createQuestion, createQuestions, Question } from '../../../../domain/models/Question';
import { createTestDatabaseConnection } from '../../../../utils/createTestDatabaseConnection';
import { GameBuilder } from '../../../../utils/GameBuilder';
import { StubExternalData } from '../../../stubs/StubExternalData';
import { AnswerEntity } from '../../entities/AnswerEntity';
import { ChoiceEntity } from '../../entities/ChoiceEntity';
import { GameEntity } from '../../entities/GameEntity';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { QuestionEntity } from '../../entities/QuestionEntity';
import { InMemoryCache } from '../../InMemoryCache';
import { InMemoryPlayerRepository } from '../player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from '../player/SQLPlayerRepository';

import * as createEntities from './createEntities';
import { InMemoryGameRepository } from './InMemoryGameRepository';
import { SQLGameRepository } from './SQLGameRepository';

const {
  createAnswerEntity,
  createChoiceEntity,
  createGameEntity,
  createPlayerEntity,
  createQuestionEntity,
  createTurnEntity,
} = createEntities;

const specs = (getRepositories: () => { gameRepository: GameRepository; playerRepository: PlayerRepository }) => {
  let repository: GameRepository;
  let playerRepository: PlayerRepository;

  let externalData: StubExternalData;
  let builder: GameBuilder;

  beforeEach(() => {
    ({ gameRepository: repository, playerRepository } = getRepositories());

    externalData = new StubExternalData();
    builder = new GameBuilder(repository, playerRepository, externalData);
  });

  it('finds all games', async () => {
    expect(await repository.findAll()).to.eql([]);

    const game = createGame();

    await playerRepository.save(game.creator);
    await repository.save(game);

    expect(await repository.findAll()).to.shallowDeepEqual([{ id: game.id }]);
  });

  it('finds a game from its id', async () => {
    expect(await repository.findGameById('')).to.be.undefined;

    const game = createGame();

    await playerRepository.save(game.creator);
    await repository.save(game);

    const savedGame = await repository.findGameById(game.id);

    expect(savedGame).to.have.property('id', game.id);
    expect(savedGame).to.have.property('code', game.code);
    expect(savedGame).to.have.property('state', GameState.idle);
  });

  it('finds a game containing a player which was updated', async () => {
    const player = new Player('Enialoiv');
    const game = createGame({ creator: player });

    game.players = [player];

    await playerRepository.save(player);
    await repository.save(game);

    player.nick = 'Slin';
    await playerRepository.save(player);

    const savedGame = await repository.findGameById(game.id);

    expect(savedGame!.players[0]).to.have.property('nick', 'Slin');
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

      const game = createGame();

      await playerRepository.save(game.creator);
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
      const game = createGame();

      await playerRepository.save(game.creator);
      await repository.save(game);

      const choice = createChoice();
      await repository.addChoices(game.id, [choice]);

      const choices = await repository.findAvailableChoices(game.id);

      expect(choices).to.have.length(1);
      expect(choices[0].id).to.eql(choice.id);
    });

    it('excludes unavailable choices', async () => {
      const game = createGame();

      await playerRepository.save(game.creator);
      await repository.save(game);

      const choice = createChoice('choice', { available: false });
      await repository.addChoices(game.id, [choice]);

      const choices = await repository.findAvailableChoices(game.id);

      expect(choices).to.have.length(0);
    });

    it('resolves an empty array when there is no more choice', async () => {
      const game = createGame();

      await playerRepository.save(game.creator);
      await repository.save(game);

      const availableChoices = await repository.findAvailableChoices(game.id);

      expect(availableChoices).to.have.length(0);
    });

    it('marks choices as unavailable', async () => {
      const game = createGame();

      await playerRepository.save(game.creator);
      await repository.save(game);

      const choice = createChoice();
      await repository.addChoices(game.id, [choice]);

      await repository.markChoicesUnavailable([choice.id]);

      expect(await repository.findAvailableChoices(game.id)).to.have.length(0);
    });
  });
};

describe('InMemoryGameRepository', () => {
  specs(() => {
    const cache = new InMemoryCache();

    return {
      playerRepository: new InMemoryPlayerRepository(cache),
      gameRepository: new InMemoryGameRepository(cache),
    };
  });

  it('reloads a game', async () => {
    const repo = new InMemoryGameRepository(new InMemoryCache());
    const game = createGame();

    await repo.save(game);

    const other = await repo.findGameById(game.id);

    game.state = GameState.finished;
    await repo.save(game);

    await repo.reload(other);

    expect(other!.state).to.eql(GameState.finished);
  });
});

describe('SQLGameRepository', () => {
  const getConnection = createTestDatabaseConnection();
  let connection: Connection;

  before(async () => {
    connection = getConnection();
  });

  let gameRepository: SQLGameRepository;
  let playerRepository: SQLPlayerRepository;

  let choiceRepository: Repository<ChoiceEntity>;
  let answerRepository: Repository<AnswerEntity>;

  before(() => {
    gameRepository = new SQLGameRepository(connection);
    playerRepository = new SQLPlayerRepository(connection);

    choiceRepository = connection.getRepository(ChoiceEntity);
    answerRepository = connection.getRepository(AnswerEntity);
  });

  specs(() => ({ gameRepository, playerRepository }));

  const startGame = async (game: GameEntity, questionMaster: PlayerEntity, question: QuestionEntity) => {
    game.state = GameState.started;
    game.questionMaster = questionMaster;
    game.question = question;

    await connection.getRepository(GameEntity).save(game);
  };

  describe('choices order in answer', () => {
    it("finds a game with the answer's choices in correct order", async () => {
      const player = await createPlayerEntity();
      const game = await createGameEntity([player]);
      const question = await createQuestionEntity(game);

      await startGame(game, player, question);

      const choice1 = await createChoiceEntity(game, 2);
      const choice2 = await createChoiceEntity(game, 1);

      await createAnswerEntity(game, player, question, [choice1, choice2]);

      const savedGame = await gameRepository.findGameById(game.id);

      expect(savedGame?.answers?.[0].choices.map(({ id }) => id)).to.eql([choice2.id, choice1.id]);
    });

    it("saves a game with the answer's choices in correct order", async () => {
      const externalData = new StubExternalData();
      const builder = new GameBuilder(gameRepository, playerRepository, externalData);

      const question = new Question('', [new Blank(1), new Blank(2)]);
      externalData.setRandomQuestions([question]);

      const game = await builder.addPlayers().start().get();
      const player = game.playersExcludingQM[0];
      const choices = player.getFirstCards(2);

      game.addAnswer(player, choices, (arr) => arr);
      await gameRepository.save(game);

      const answer = game.answers[0];
      const savedChoices = await choiceRepository.findByIds(answer.choices.map(({ id }) => id));

      for (const [index, choice] of Object.entries(choices)) {
        const savedChoice = savedChoices.find(({ id }) => id === choice.id);
        const expectedPosition = Number(index) + 1;

        expect(savedChoice).to.have.property('position', expectedPosition);
      }
    });
  });

  describe('answers order in game', () => {
    it('finds a game with the answers in correct order', async () => {
      const player = await createPlayerEntity();
      const game = await createGameEntity([player]);
      const question = await createQuestionEntity(game);

      await startGame(game, player, question);

      const answer1 = await createAnswerEntity(game, player, question, [], 2);
      const answer2 = await createAnswerEntity(game, player, question, [], 1);

      const savedGame = await gameRepository.findGameById(game.id);

      expect(savedGame?.answers?.map(({ id }) => id)).to.eql([answer2.id, answer1.id]);
    });

    it("saves a game with the answer's choices in correct order", async () => {
      const externalData = new StubExternalData();
      const builder = new GameBuilder(gameRepository, playerRepository, externalData);

      builder.randomize = (array) => array.reverse();

      const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();

      const answers = await answerRepository.findByIds(game.answers.map(({ id }) => id));

      for (const [index, answer] of Object.entries(game.answers)) {
        const savedAnswer = answers.find(({ id }) => id === answer.id);
        const expectedPosition = Number(index) + 1;

        expect(savedAnswer).to.have.property('position', expectedPosition);
      }
    });
  });

  describe('answers order in turn', () => {
    it('finds a turn with the answers in correct order', async () => {
      const player = await createPlayerEntity();
      const game = await createGameEntity([player]);
      const question = await createQuestionEntity(game);

      await startGame(game, player, question);

      const answer1 = await createAnswerEntity(game, player, question, [], 2);
      const answer2 = await createAnswerEntity(game, player, question, [], 1);

      await createTurnEntity(game, player, player, question, [answer1, answer2]);

      const savedTurn = await gameRepository.findTurns(game.id);

      expect(savedTurn[0].answers.map(({ id }) => id)).to.eql([answer2.id, answer1.id]);
    });

    // save is already tested with the game entity
  });
});
