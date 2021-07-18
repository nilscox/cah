import { expect } from 'chai';

import { GameState } from '../../domain/enums/GameState';
import { PlayState } from '../../domain/enums/PlayState';
import { InvalidPlayStateError } from '../../domain/errors/InvalidPlayStateError';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubExternalData } from '../../infrastructure/stubs/StubExternalData';
import { GameBuilder } from '../../utils/GameBuilder';
import { GameService } from '../services/GameService';

import { NextTurnHandler } from './NextTurnCommand';

describe('NextTurnCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let externalData: StubExternalData;
  let publisher: StubEventPublisher;

  let handler: NextTurnHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    publisher = new StubEventPublisher();
    gameService = new GameService(playerRepository, gameRepository, publisher);
    externalData = new StubExternalData();

    handler = new NextTurnHandler(gameService, gameRepository);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  const execute = (player: Player) => {
    return handler.execute({}, { player });
  };

  it('ends the current turn and starts the next one', async () => {
    const game = await builder.addPlayers().start(2).play(PlayState.endOfTurn).get();
    const lastQuestionMaster = game.questionMaster;
    const lastQuestion = game.question;
    const lastWinner = game.winner!;
    const nextQuestion = await gameRepository.getQuestions(game.id)[1];

    await execute(game.questionMaster);

    expect(game.playState).to.eql(PlayState.playersAnswer);
    expect(game.questionMaster.id).to.eql(lastWinner.id);
    expect(game.question.id).to.eql(nextQuestion.id);
    expect(game.answers).to.eql([]);
    expect(game.winner).to.be.undefined;

    const turns = gameRepository.getTurns(game.id);

    expect(turns).to.have.length(1);
    expect(turns[0]).to.have.nested.property('questionMaster.id', lastQuestionMaster.id);
    expect(turns[0]).to.have.nested.property('question.id', lastQuestion.id);
    expect(turns[0]).to.have.property('answers').that.have.length(game.playersExcludingQM.length);
    expect(turns[0]).to.have.nested.property('winner.id', lastWinner.id);

    expect(publisher.events).to.deep.include({ type: 'TurnFinished', game });
    expect(publisher.events).to.deep.include({ type: 'TurnStarted', game });
  });

  it('deals new cards to the players', async () => {
    const game = await builder.addPlayers().start(2).play(PlayState.endOfTurn).get();
    const players = game.playersExcludingQM;

    await execute(game.questionMaster);

    expect(game.questionMaster.getCards()).to.have.length(11);

    for (const player of players) {
      const cards = player.getCards();

      expect(cards).to.have.length(11);
      expect(publisher.events).to.deep.include({ type: 'CardsDealt', player, cards: cards.slice(-1) });
    }
  });

  it('terminates the game', async () => {
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();

    await execute(game.questionMaster);

    expect(game.state).to.eql(GameState.finished);
    expect(game.playState).to.be.undefined;
    expect(game.questionMaster).to.be.undefined;
    expect(game.question).to.be.undefined;
    expect(game.answers).to.be.undefined;
    expect(game.winner).to.be.undefined;

    expect(gameRepository.getTurns(game.id)).to.have.length(1);

    expect(publisher.events).to.deep.include({ type: 'TurnFinished', game });
    expect(publisher.events).to.deep.include({ type: 'GameFinished', game });

    for (const player of game.players) {
      expect(player.getCards()).to.have.length(0);
    }
  });

  it('does not end the current turn when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.questionMasterSelection]) {
      const game = await builder.addPlayers().start().play(playState).get();

      const error = await expect(execute(game.questionMaster)).to.be.rejectedWith(InvalidPlayStateError);
      expect(error).to.shallowDeepEqual({ expected: PlayState.endOfTurn, actual: playState });
    }
  });
});
