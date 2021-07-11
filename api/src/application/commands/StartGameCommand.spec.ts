import { expect } from 'chai';

import { InvalidGameStateError, NotEnoughPlayersError } from '../../domain/errors';
import { Game, GameState, PlayState } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { Blank } from '../../domain/models/Question';
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/InMemoryPlayerRepository';
import { StubExternalData } from '../../infrastructure/StubExternalData';
import { createQuestion } from '../../utils/entityCreators';
import { GameBuilder } from '../../utils/GameBuilder';
import { GameService } from '../services/GameService';

import { StartGameCommand, StartGameHandler } from './StartGameCommand';

describe('StartGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let externalData: StubExternalData;

  let handler: StartGameHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    gameService = new GameService(playerRepository, gameRepository);
    externalData = new StubExternalData();

    handler = new StartGameHandler(gameService, gameRepository, externalData);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  const execute = (questionMaster: Player, turns: number) => {
    return handler.execute(new StartGameCommand(questionMaster.id, turns));
  };

  describe('when the game starts', () => {
    let game: Game;
    let questionMaster: Player;

    beforeEach(async () => {
      game = await builder.addPlayers(4).get();
      questionMaster = game.players[1];

      await execute(questionMaster, 2);
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
      expect(choices).to.have.length(50);
    });

    it('computes the number of cards', async () => {
      const game = await builder.addPlayers(5).get();
      const questionMaster = game.players[0];

      const createBlanks = (blanks: number[]) => blanks.map((place) => new Blank(place));

      // 9 blanks
      externalData.setRandomQuestions([
        createQuestion(),
        createQuestion({ blanks: createBlanks([1, 2, 3]) }),
        createQuestion({ blanks: createBlanks([0]) }),
        createQuestion({ blanks: createBlanks([9, 8, 7, 6]) }),
      ]);

      await execute(questionMaster, 4);

      expect(gameRepository.getQuestions(game.id)).to.have.length(4);
      expect(gameRepository.getChoices(game.id)).to.have.length(91);
    });

    it('deals the cards to all players', () => {
      for (const player of game.players) {
        expect(player.getCards()).to.have.length(11);
        // expect(gameEvents.getPlayerEvents(player)).to.deep.include({ type: 'CardsDealt', cards: player.cards });
      }
    });

    it('notifies that the game has started', () => {
      // expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'GameStarted' });
      // expect(gameEvents.getGameEvents(game)).to.deep.include({
      //   type: 'TurnStarted',
      //   questionMaster: questionMaster,
      //   question: questions[0],
      // })
    });
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
