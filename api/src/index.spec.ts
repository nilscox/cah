import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { Container } from 'typedi';
import { getConnection, getCustomRepository, getRepository } from 'typeorm';

import { GameState } from './domain/entities/Game';
import { AnswerRepositoryToken } from './domain/interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from './domain/interfaces/ChoiceRepository';
import { GameEventsToken } from './domain/interfaces/GameEvents';
import { GameRepositoryToken } from './domain/interfaces/GameRepository';
import { PlayerRepositoryToken } from './domain/interfaces/PlayerRepository';
import { QuestionRepositoryToken } from './domain/interfaces/QuestionRepository';
import { TurnRepositoryToken } from './domain/interfaces/TurnRepository';
import { RandomServiceToken } from './domain/services/RandomService';
import { createChoices, createQuestions } from './domain/tests/creators';
import { StubGameEvents } from './domain/tests/stubs/StubGameEvents';
import { StubRandomService } from './domain/tests/stubs/StubRandomService';
import { GiveChoicesSelection } from './domain/use-cases/GiveChoicesSelection';
import { NextTurn } from './domain/use-cases/NextTurn';
import { PickWinningAnswer } from './domain/use-cases/PickWinningAnswer';
import { StartGame } from './domain/use-cases/StartGame';
import { GameEntity } from './infrastructure/database/entities/GameEntity';
import { PlayerEntity } from './infrastructure/database/entities/PlayerEntity';
import { QuestionEntity } from './infrastructure/database/entities/QuestionEntity';
import { SQLAnswerRepository } from './infrastructure/database/repositories/SQLAnswerRepository';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';
import { createPlayer, createTestDatabase } from './infrastructure/database/test-utils';

chai.use(chaiAsPromised);
chai.use(chaiShallowDeepEqual);

before(() => {
  process.stdout.write('\x1Bc');
});

describe('end-to-end', () => {
  createTestDatabase();

  let gameRepository: SQLGameRepository;
  let playerRepository: SQLPlayerRepository;
  let questionRepository: SQLQuestionRepository;
  let choiceRepository: SQLChoiceRepository;
  let turnRepository: SQLTurnRepository;
  let answerRepository: SQLAnswerRepository;

  let gameEvents: StubGameEvents;
  let randomService: StubRandomService;

  before(() => {
    Container.reset();

    gameRepository = new SQLGameRepository();
    playerRepository = getCustomRepository(SQLPlayerRepository);
    questionRepository = getCustomRepository(SQLQuestionRepository);
    choiceRepository = getCustomRepository(SQLChoiceRepository);
    turnRepository = getCustomRepository(SQLTurnRepository);
    answerRepository = getCustomRepository(SQLAnswerRepository);

    Container.set(GameRepositoryToken, gameRepository);
    Container.set(PlayerRepositoryToken, playerRepository);
    Container.set(QuestionRepositoryToken, questionRepository);
    Container.set(ChoiceRepositoryToken, choiceRepository);
    Container.set(TurnRepositoryToken, turnRepository);
    Container.set(AnswerRepositoryToken, answerRepository);

    gameEvents = new StubGameEvents();
    randomService = new StubRandomService();

    Container.set(GameEventsToken, gameEvents);
    Container.set(RandomServiceToken, randomService);
  });

  beforeEach(async () => {
    await getConnection().query('DELETE FROM game');
    gameEvents.clear();
  });

  it('plays a full game', async () => {
    const startGame = Container.get(StartGame);
    const giveChoicesSelection = Container.get(GiveChoicesSelection);
    const pickWinningAnswer = Container.get(PickWinningAnswer);
    const nextTurn = Container.get(NextTurn);

    let nils = await createPlayer({ nick: 'nils' });
    let tom = await createPlayer({ nick: 'tom' });
    let jeanne = await createPlayer({ nick: 'jeanne' });

    let game = await getRepository(GameEntity).create({ code: '' });

    const reload = async () => {
      nils = (await getRepository(PlayerEntity).findOne(nils.id))!;
      tom = (await getRepository(PlayerEntity).findOne(tom.id))!;
      jeanne = (await getRepository(PlayerEntity).findOne(jeanne.id))!;
      game = (await getRepository(GameEntity).findOne(game.id))!;
    };

    questionRepository.pickRandomQuestions = (count: number) => Promise.resolve(createQuestions(count));
    choiceRepository.pickRandomChoices = (count: number) => Promise.resolve(createChoices(count));

    game.players = [nils, tom, jeanne];
    await gameRepository.save(game);
    await reload();

    await startGame.startGame(game, nils, 4);
    await reload();

    for (let i = 0; i < 4; ++i) {
      for (const player of game.playersExcludingQM) {
        await giveChoicesSelection.giveChoicesSelection(game, player, [player.cards[0]]);
        await reload();
      }

      await pickWinningAnswer.pickWinningAnswer(game, game.questionMaster!, 0);
      await reload();

      await nextTurn.nextTurn(game);
      await reload();
    }

    expect(game.state).to.eql(GameState.finished);
  });
});
