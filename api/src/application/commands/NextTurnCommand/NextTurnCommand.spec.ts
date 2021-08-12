import { expect } from 'chai';

import { InvalidPlayStateError } from '../../../domain/errors/InvalidPlayStateError';
import { Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { GameState, PlayState } from '../../../shared/enums';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { NextTurnHandler } from './NextTurnCommand';

describe('NextTurnCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let handler: NextTurnHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, publisher, builder } = deps);

    handler = instanciateHandler(NextTurnHandler, deps);
  });

  const execute = async (game: Game | undefined, player: Player) => {
    await handler.execute({}, { player });

    gameRepository.reload(game);
  };

  it('ends the current turn and starts the next one', async () => {
    const game = await builder.addPlayers().start(2).play(PlayState.endOfTurn).get();
    const lastQuestionMaster = game.questionMaster;
    const lastQuestion = game.question;
    const lastWinner = game.winner!;
    const nextQuestion = await gameRepository.getQuestions(game.id)[1];

    await execute(game, game.questionMaster);

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

    expect(publisher.findEvent('TurnFinished')).to.eql({ type: 'TurnFinished', game });
    expect(publisher.findEvent('TurnStarted')).to.eql({ type: 'TurnStarted', game });
  });

  it('deals new cards to the players', async () => {
    const game = await builder.addPlayers().start(2).play(PlayState.endOfTurn).get();
    const questionMaster = game.questionMaster;
    const players = game.playersExcludingQM;

    await execute(game, questionMaster);

    expect(questionMaster.cards).to.have.length(11);

    for (const player of players) {
      playerRepository.reload(player);

      expect(player.cards).to.have.length(11);
      expect(publisher.events).to.deep.include({ type: 'CardsDealt', player, cards: player.cards.slice(-1) });
    }
  });

  it('terminates the game', async () => {
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();

    await execute(game, game.questionMaster);

    expect(game.state).to.eql(GameState.finished);
    expect(game.playState).to.be.undefined;
    expect(game.questionMaster).to.be.undefined;
    expect(game.question).to.be.undefined;
    expect(game.answers).to.be.undefined;
    expect(game.winner).to.be.undefined;

    expect(gameRepository.getTurns(game.id)).to.have.length(1);

    expect(publisher.findEvent('TurnFinished')).to.eql({ type: 'TurnFinished', game });
    expect(publisher.findEvent('GameFinished')).to.eql({ type: 'GameFinished', game });

    for (const player of game.players) {
      expect(player.cards).to.have.length(0);
    }
  });

  it('does not end the current turn when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.questionMasterSelection]) {
      const game = await builder.addPlayers().start().play(playState).get();

      const error = await expect(execute(undefined, game.questionMaster)).to.be.rejectedWith(InvalidPlayStateError);
      expect(error).to.shallowDeepEqual({ expected: PlayState.endOfTurn, actual: playState });
    }
  });
});
