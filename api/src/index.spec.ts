import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';
import { getCustomRepository, getRepository } from 'typeorm';

import { GameState } from './domain/entities/Game';
import { GameService } from './domain/services/GameService';
import { createChoices, createQuestions } from './domain/tests/creators';
import { StubGameEvents } from './domain/tests/stubs/StubGameEvents';
import { StubRandomService } from './domain/tests/stubs/StubRandomService';
import { GiveChoicesSelection } from './domain/use-cases/GiveChoicesSelection';
import { NextTurn } from './domain/use-cases/NextTurn';
import { PickWinningAnswer } from './domain/use-cases/PickWinningAnswer';
import { StartGame } from './domain/use-cases/StartGame';
import { GameEntity } from './infrastructure/database/entities/GameEntity';
import { PlayerEntity } from './infrastructure/database/entities/PlayerEntity';
import { SQLChoiceRepository } from './infrastructure/database/repositories/SQLChoiceRepository';
import { SQLGameRepository } from './infrastructure/database/repositories/SQLGameRepository';
import { SQLPlayerRepository } from './infrastructure/database/repositories/SQLPlayerRepository';
import { SQLQuestionRepository } from './infrastructure/database/repositories/SQLQuestionRepository';
import { SQLTurnRepository } from './infrastructure/database/repositories/SQLTurnRepository';
import { createGame, createPlayer, createTestDatabase } from './infrastructure/database/test-utils';

chai.use(chaiAsPromised);
chai.use(chaiShallowDeepEqual);

before(() => {
  process.stdout.write('\x1Bc');
});

describe('end-to-end', () => {
  createTestDatabase();

  it('plays a full game', async () => {
    const gameRepository = new SQLGameRepository();
    const playerRepository = getCustomRepository(SQLPlayerRepository);
    const questionRepository = getCustomRepository(SQLQuestionRepository);
    const choiceRepository = getCustomRepository(SQLChoiceRepository);
    const turnRepository = getCustomRepository(SQLTurnRepository);

    const gameEvents = new StubGameEvents();
    const gameService = new GameService(choiceRepository, playerRepository, gameEvents);
    const randomService = new StubRandomService();

    const startGame = new StartGame(questionRepository, choiceRepository, gameRepository, gameService, gameEvents);
    const giveChoicesSelection = new GiveChoicesSelection(
      playerRepository,
      gameRepository,
      gameService,
      randomService,
      gameEvents,
    );
    const pickWinningAnswer = new PickWinningAnswer(gameRepository, gameService, gameEvents);
    const nextTurn = new NextTurn(gameRepository, questionRepository, turnRepository, gameService, gameEvents);

    let nils = await createPlayer({ nick: 'nils' });
    let tom = await createPlayer({ nick: 'tom' });
    let jeanne = await createPlayer({ nick: 'jeanne' });

    let game = await createGame();

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

    for (let i = 0; i < 4; ++i) {
      for (const player of game.playersExcludingQM) {
        await giveChoicesSelection.giveChoicesSelection(game, player, [player.cards[0]]);
      }

      await pickWinningAnswer.pickWinningAnswer(game, game.questionMaster!, 0);
      await nextTurn.nextTurn(game);
    }

    expect(game.state).to.eql(GameState.finished);
  });
});
