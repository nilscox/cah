import { expect } from 'chai';
import { Connection, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { v4 as uuid } from 'uuid';

import { GameState, PlayState } from '../../../../../../shared/enums';
import { GameRepository } from '../../../../application/interfaces/GameRepository';
import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { Blank } from '../../../../domain/models/Blank';
import { createChoice } from '../../../../domain/models/Choice';
import { Game } from '../../../../domain/models/Game';
import { Player } from '../../../../domain/models/Player';
import { createQuestion, createQuestions, Question } from '../../../../domain/models/Question';
import { GameBuilder } from '../../../../utils/GameBuilder';
import { StubExternalData } from '../../../stubs/StubExternalData';
import { entities } from '../../entities';
import { AnswerEntity } from '../../entities/AnswerEntity';
import { ChoiceEntity } from '../../entities/ChoiceEntity';
import { GameEntity } from '../../entities/GameEntity';
import { PlayerEntity } from '../../entities/PlayerEntity';
import { QuestionEntity } from '../../entities/QuestionEntity';
import { InMemoryCache } from '../../InMemoryCache';
import { InMemoryPlayerRepository } from '../player/InMemoryPlayerRepository';
import { SQLPlayerRepository } from '../player/SQLPlayerRepository';

import { InMemoryGameRepository } from './InMemoryGameRepository';
import { SQLGameRepository } from './SQLGameRepository';

const debug = false;
const keepDatabase = debug;
const logging = debug;

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

  it('finds a game containing a player which was updated', async () => {
    const player = new Player('Enialoiv');
    const game = new Game();

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
  specs(() => {
    const cache = new InMemoryCache();

    return {
      playerRepository: new InMemoryPlayerRepository(cache),
      gameRepository: new InMemoryGameRepository(cache),
    };
  });

  it('reloads a game', async () => {
    const repo = new InMemoryGameRepository(new InMemoryCache());
    const game = new Game();

    await repo.save(game);

    const other = await repo.findGameById(game.id);

    game.state = GameState.finished;
    await repo.save(game);

    await repo.reload(other);

    expect(other!.state).to.eql(GameState.finished);
  });
});

describe('SQLGameRepository', () => {
  let connection: Connection;
  let gameRepository: SQLGameRepository;
  let playerRepository: SQLPlayerRepository;

  before(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: keepDatabase ? './db.sqlite' : ':memory:',
      entities,
      synchronize: true,
      logging,
      namingStrategy: new SnakeNamingStrategy(),
    });

    gameRepository = new SQLGameRepository(connection);
    playerRepository = new SQLPlayerRepository(connection);
  });

  after(async () => {
    await connection?.close();
  });

  afterEach(async () => {
    if (!keepDatabase) {
      await connection.synchronize(true);
    }
  });

  specs(() => ({ gameRepository, playerRepository }));

  const createPlayer = async () => {
    const player = new PlayerEntity();

    player.id = uuid();
    player.nick = 'nick';

    await connection.getRepository(PlayerEntity).save(player);

    return player;
  };

  const createGame = async (players: PlayerEntity[]) => {
    const game = new GameEntity();

    game.id = uuid();
    game.code = 'code';
    game.state = GameState.idle;
    game.players = players;

    await connection.getRepository(GameEntity).save(game);

    return game;
  };

  const startGame = async (game: GameEntity, questionMaster: PlayerEntity, question: QuestionEntity) => {
    game.state = GameState.started;
    game.questionMaster = questionMaster;
    game.question = question;

    await connection.getRepository(GameEntity).save(game);
  };

  const createChoice = async (game: GameEntity, position: number) => {
    const choice = new ChoiceEntity();

    choice.id = uuid();
    choice.text = 'choice at ' + position;
    choice.position = position;
    choice.game = game;

    await connection.getRepository(ChoiceEntity).save(choice);

    return choice;
  };

  const createQuestion = async (game: GameEntity) => {
    const question = new QuestionEntity();

    question.id = uuid();
    question.text = 'question';
    question.game = game;
    question.blanks = [];

    await connection.getRepository(QuestionEntity).save(question);

    return question;
  };

  const createAnswer = async (
    game: GameEntity,
    player: PlayerEntity,
    question: QuestionEntity,
    choices: ChoiceEntity[],
  ) => {
    const answer = new AnswerEntity();

    answer.id = uuid();
    answer.choices = choices;
    answer.player = player;
    answer.question = question;
    answer.current_of_game = game;

    await connection.getRepository(AnswerEntity).save(answer);

    return answer;
  };

  it("finds a game with the answer's choices in correct order", async () => {
    const player = await createPlayer();
    const game = await createGame([player]);
    const question = await createQuestion(game);

    await startGame(game, player, question);

    const choice1 = await createChoice(game, 2);
    const choice2 = await createChoice(game, 1);

    await createAnswer(game, player, question, [choice1, choice2]);

    const savedGame = await new SQLGameRepository(connection).findGameById(game.id);

    expect(savedGame?.answers?.[0].choices.map(({ id }) => id)).to.eql([choice2.id, choice1.id]);
  });

  it("saves a game with the answer's choices in correct order", async () => {
    const externalData = new StubExternalData();
    const builder = new GameBuilder(gameRepository, playerRepository, externalData);

    const question = new Question('', [new Blank(1), new Blank(2)]);
    externalData.setRandomQuestions([question]);

    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();

    const entity = GameEntity.toPersistence(game);

    expect(entity.currentAnswers[0].choices.map(({ position }) => position)).to.eql([1, 2]);
  });
});
