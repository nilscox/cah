import { expect } from 'chai';
import { Container } from 'typedi';

import { Game, GameState, PlayState } from '../entities/Game';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEventsToken } from '../interfaces/GameEvents';
import { GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { TurnRepositoryToken } from '../interfaces/TurnRepository';
import { createChoices, createPlayers, createQuestion, createStartedGame } from '../tests/creators';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { InMemoryQuestionRepository } from '../tests/repositories/InMemoryQuestionRepository';
import { InMemoryTurnRepository } from '../tests/repositories/InMemoryTurnRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';

import { NextTurn } from './NextTurn';

describe('NextTurn', () => {
  const gameRepository = new InMemoryGameRepository();
  const playerRepository = new InMemoryPlayerRepository();
  const questionRepository = new InMemoryQuestionRepository();
  const choiceRepository = new InMemoryChoiceRepository();
  const turnRepository = new InMemoryTurnRepository();

  const gameEvents = new StubGameEvents();

  let useCase: NextTurn;

  before(() => {
    Container.reset();

    Container.set(GameRepositoryToken, gameRepository);
    Container.set(PlayerRepositoryToken, playerRepository);
    Container.set(QuestionRepositoryToken, questionRepository);
    Container.set(ChoiceRepositoryToken, choiceRepository);
    Container.set(TurnRepositoryToken, turnRepository);

    Container.set(GameEventsToken, gameEvents);

    useCase = Container.get(NextTurn);
  });

  const initializeGame = () => {
    const players = createPlayers(4);
    const [questionMaster, winner] = players;

    for (const player of players) {
      player.cards = createChoices(Game.cardsPerPlayer);
    }

    const game = createStartedGame({
      playState: PlayState.endOfTurn,
      players,
      questionMaster,
      winner,
    });

    for (const player of game.playersExcludingQM) {
      player.cards.splice(0, 1);
    }

    return game;
  };

  beforeEach(() => {
    turnRepository.clear();
  });

  it('ends the current turn and starts the next one', async () => {
    const game = initializeGame();
    const { players, winner, questionMaster } = game;

    const nextQuestion = createQuestion();

    questionRepository.createQuestions(game, [nextQuestion]);
    choiceRepository.createChoices(game, createChoices(3));

    await useCase.nextTurn(game);

    expect(game.playState).to.eql(PlayState.playersAnswer);
    expect(game.question).to.eql(nextQuestion);
    expect(game.questionMaster).to.eql(winner);
    expect(game.answers).to.have.length(0);

    for (const player of game.players) {
      expect(player.cards).to.have.length(11);
    }

    const turns = turnRepository.getTurns();

    expect(turns).to.have.length(1);

    for (const player of players.filter((player) => player !== questionMaster)) {
      expect(gameEvents.getPlayerEvents(player)).to.deep.include({
        type: 'CardsDealt',
        cards: player.cards.slice(-1),
      });
    }

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'TurnEnded', turn: turns[0] });
    expect(gameEvents.getGameEvents(game)).to.deep.include({
      type: 'TurnStarted',
      questionMaster: winner,
      question: nextQuestion,
    });
  });

  it('terminates the game', async () => {
    const game = initializeGame();

    await useCase.nextTurn(game);

    expect(game.state).to.eql(GameState.finished);
    expect(game.playState).to.be.undefined;
    expect(game.questionMaster).to.be.undefined;
    expect(game.question).to.be.undefined;
    expect(game.answers).to.have.length(0);
    expect(game.winner).to.be.undefined;

    const turns = turnRepository.getTurns();

    expect(turns).to.have.length(1);

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'TurnEnded', turn: turns[0] });
    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'GameFinished' });
  });

  it('does not end the current turn when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.questionMasterSelection]) {
      const game = createStartedGame({ playState });

      const err = await expect(useCase.nextTurn(game)).to.be.rejectedWith(InvalidPlayStateError);

      expect(err).to.have.property('expected', PlayState.endOfTurn);
    }
  });
});
