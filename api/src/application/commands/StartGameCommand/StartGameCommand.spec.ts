import { expect } from 'earljs';

import { InvalidGameStateError } from '../../../domain/errors/InvalidGameStateError';
import { NotEnoughPlayersError } from '../../../domain/errors/NotEnoughPlayersError';
import { PlayerIsNotInTheGameError } from '../../../domain/errors/PlayerIsNotInTheGame';
import { createBlanks } from '../../../domain/models/Blank';
import { Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { createQuestion } from '../../../domain/models/Question';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { StubExternalData } from '../../../infrastructure/stubs/StubExternalData';
import { StubRandomService } from '../../../infrastructure/stubs/StubRandomService';
import { GameState, PlayState } from '../../../shared/enums';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { expectError } from '../../../utils/expectError';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { StartGameCommand, StartGameHandler } from './StartGameCommand';

describe('StartGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;
  let publisher: StubEventPublisher;
  let randomService: StubRandomService;
  let builder: GameBuilder;

  let handler: StartGameHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, externalData, publisher, randomService, builder } = deps);

    handler = instanciateHandler(StartGameHandler, deps);
  });

  const execute = (questionMaster: Player | null, turns: number, player: Player) => {
    return handler.execute(new StartGameCommand(questionMaster?.id ?? null, turns), { player });
  };

  describe('when the game starts', () => {
    let game: Game;
    let questionMaster: Player;

    beforeEach(async () => {
      game = await builder.addPlayers(4).get();
      questionMaster = game.players[1];

      await execute(questionMaster, 2, questionMaster);

      gameRepository.reload(game);
    });

    it("initializes a started game's properties", () => {
      const questions = gameRepository.getQuestions(game.id);
      const choices = gameRepository.getChoices(game.id);

      expect(game.state).toEqual(GameState.started);
      expect(game.playState).toEqual(PlayState.playersAnswer);
      expect(game.answers).toEqual([]);
      expect(game.questionMaster?.id).toEqual(questionMaster.id);
      expect(game.question?.id).toEqual(questions[0].id);

      expect(questions).toBeAnArrayOfLength(2);
      expect(choices).toBeAnArrayOfLength(94);
    });

    it('computes the number of cards', async () => {
      const game = await builder.addPlayers(5).get();
      const questionMaster = game.players[0];

      // 9 blanks
      externalData.setRandomQuestions([
        createQuestion(),
        createQuestion({ blanks: createBlanks(3) }),
        createQuestion({ blanks: createBlanks(1) }),
        createQuestion({ blanks: createBlanks(4) }),
      ]);

      await execute(questionMaster, 4, questionMaster);

      expect(gameRepository.getQuestions(game.id)).toBeAnArrayOfLength(4);
      expect(gameRepository.getChoices(game.id)).toBeAnArrayOfLength(146);
    });

    it('deals the cards to all players', () => {
      for (const player of game.players) {
        const cards = player.cards;

        for (const card of cards) {
          expect(card.available).toEqual(false);
        }

        expect(cards).toBeAnArrayOfLength(11);
        expect(publisher.events).toBeAnArrayWith(expect.objectWith({ type: 'CardsDealt', player, cards }));
      }
    });

    it('notifies that the game has started', () => {
      expect(publisher.findEvent('GameStarted')).toEqual(expect.objectWith({ game }));
      expect(publisher.findEvent('TurnStarted')).toEqual(expect.objectWith({ game }));
    });

    it('randomly picks the initial question master', async () => {
      const game = await builder.addPlayers(4).get();
      const lastPlayer = game.players[game.players.length - 1];

      randomService.randomize = (arr) => arr.reverse();

      await execute(null, 1, game.players[0]);

      gameRepository.reload(game);

      expect(game.questionMaster?.id).toEqual(lastPlayer.id);
    });
  });

  it('fails if the question master is not is the game', async () => {
    const game = await builder.addPlayers(3).get();
    const questionMaster = new Player('NOTinDAgame');

    await playerRepository.save(questionMaster);

    await expect(execute(questionMaster, 1, game.players[0])).toBeRejected(PlayerIsNotInTheGameError);
  });

  it('does not start a game that is already started', async () => {
    const game = await builder.addPlayers(3).start().get();
    const player = game.players[0];

    const error = await expectError(execute(null, 1, player), InvalidGameStateError);
    expect(error).toBeAnObjectWith({ expected: GameState.idle, actual: GameState.started });
  });

  it('does not start a game containing less than 3 players', async () => {
    const game = await builder.addPlayers(2).get();
    const player = game.players[0];

    const error = await expectError(execute(null, 1, player), NotEnoughPlayersError);
    expect(error).toBeAnObjectWith({ minimumNumberOfPlayers: 3, actualNumberOfPlayers: 2 });
  });
});
