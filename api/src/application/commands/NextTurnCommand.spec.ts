import { expect } from 'chai';

import { GameState, PlayState } from '../../../../shared/enums';
import { InvalidPlayStateError } from '../../domain/errors/InvalidPlayStateError';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { GameBuilder } from '../../utils/GameBuilder';
import { instanciateHandler } from '../../utils/injector';
import { instanciateStubDependencies } from '../../utils/stubDependencies';

import { NextTurnHandler } from './NextTurnCommand';

describe('NextTurnCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let handler: NextTurnHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, publisher, builder } = deps);

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

    expect(publisher.events).to.deep.include({ type: 'TurnFinished', game });
    expect(publisher.events).to.deep.include({ type: 'TurnStarted', game });
  });

  it.skip('deals new cards to the players', async () => {
    const game = await builder.addPlayers().start(2).play(PlayState.endOfTurn).get();
    const players = game.playersExcludingQM;

    await execute(game, game.questionMaster);

    expect(game.questionMaster.getCards()).to.have.length(11);

    for (const player of players) {
      const cards = player.getCards();

      expect(cards).to.have.length(11);
      expect(publisher.events).to.deep.include({ type: 'CardsDealt', player, cards: cards.slice(-1) });
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

    expect(publisher.events).to.deep.include({ type: 'TurnFinished', game });
    expect(publisher.events).to.deep.include({ type: 'GameFinished', game });

    for (const player of game.players) {
      expect(player.getCards()).to.have.length(0);
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
