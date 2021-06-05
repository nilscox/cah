import { expect } from 'chai';
import request from 'supertest';
import { Container } from 'typedi';
import { getConnection, getCustomRepository } from 'typeorm';

import { app } from './application/web';
import { GameState } from './domain/entities/Game';
import { AnswerRepositoryToken } from './domain/interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from './domain/interfaces/ChoiceRepository';
import { GameEventsToken } from './domain/interfaces/GameEvents';
import { GameRepositoryToken } from './domain/interfaces/GameRepository';
import { PlayerRepositoryToken } from './domain/interfaces/PlayerRepository';
import { QuestionRepositoryToken } from './domain/interfaces/QuestionRepository';
import { TurnRepositoryToken } from './domain/interfaces/TurnRepository';
import { RandomServiceToken } from './domain/services/RandomService';
import { StubGameEvents } from './domain/tests/stubs/StubGameEvents';
import { StubRandomService } from './domain/tests/stubs/StubRandomService';
import { SQLAnswerRepository } from './infrastructure/database/repositories/SQLAnswerRepository';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';
import { createTestDatabase } from './infrastructure/database/test-utils';

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
    const asNils = request.agent(app);
    await asNils.post('/api/player').send({ nick: 'nils' }).expect(201);

    const asTom = request.agent(app);
    await asTom.post('/api/player').send({ nick: 'tom' }).expect(201);

    const asJeanne = request.agent(app);
    await asJeanne.post('/api/player').send({ nick: 'jeanne' }).expect(201);

    const { body: game } = await asNils.post('/api/game').send().expect(201);

    expect(game).to.have.property('code').that.is.a('string').of.length(4);
    expect(game).to.have.property('state', GameState.idle);
  });
});
