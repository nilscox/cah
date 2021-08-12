import { expect } from 'chai';

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
import { GameState, PlayState } from '../../../shared/enums';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { StartGameCommand, StartGameHandler } from './StartGameCommand';

describe('StartGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let handler: StartGameHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, externalData, publisher, builder } = deps);

    handler = instanciateHandler(StartGameHandler, deps);
  });

  const execute = (questionMaster: Player, turns: number, player = questionMaster) => {
    return handler.execute(new StartGameCommand(questionMaster.id, turns), { player });
  };

  describe('when the game starts', () => {
    let game: Game;
    let questionMaster: Player;

    beforeEach(async () => {
      game = await builder.addPlayers(4).get();
      questionMaster = game.players[1];

      await execute(questionMaster, 2);

      gameRepository.reload(game);
    });

    it("initializes a started game's properties", () => {
      const questions = gameRepository.getQuestions(game.id);
      const choices = gameRepository.getChoices(game.id);

      expect(game.state).to.eql(GameState.started);
      expect(game.playState).to.eql(PlayState.playersAnswer);
      expect(game.answers).to.eql([]);
      expect(game.questionMaster?.id).to.eql(questionMaster.id);
      expect(game.question?.id).to.eql(questions[0].id);

      expect(questions).to.have.length(2);
      expect(choices).to.have.length(94);
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

      await execute(questionMaster, 4);

      expect(gameRepository.getQuestions(game.id)).to.have.length(4);
      expect(gameRepository.getChoices(game.id)).to.have.length(146);
    });

    it('deals the cards to all players', () => {
      for (const player of game.players) {
        const cards = player.cards;

        for (const card of cards) {
          expect(card.available).to.be.false;
        }

        expect(cards).to.have.length(11);
        expect(publisher.events).to.deep.include({ type: 'CardsDealt', player, cards });
      }
    });

    it('notifies that the game has started', () => {
      expect(publisher.findEvent('GameStarted')).to.shallowDeepEqual({ game: { id: game.id } });
      expect(publisher.findEvent('TurnStarted')).to.shallowDeepEqual({ game: { id: game.id } });
    });
  });

  it('fails if the question master is not is the game', async () => {
    const game = await builder.addPlayers(3).get();
    const player = new Player('NOTinDAgame');

    await playerRepository.save(player);

    await expect(execute(player, 1, game.players[0])).to.be.rejectedWith(PlayerIsNotInTheGameError);
  });

  it('does not start a game that is already started', async () => {
    const game = await builder.addPlayers(3).start().get();
    const player = game.players[0];

    const error = await expect(execute(player, 1)).to.be.rejectedWith(InvalidGameStateError);
    expect(error).to.shallowDeepEqual({ expected: GameState.idle, actual: GameState.started });
  });

  it('does not start a game containing less than 3 players', async () => {
    const game = await builder.addPlayers(2).get();
    const player = game.players[0];

    const error = await expect(execute(player, 1)).to.be.rejectedWith(NotEnoughPlayersError);
    expect(error).to.shallowDeepEqual({ minimumNumberOfPlayers: 3, actualNumberOfPlayers: 2 });
  });
});
