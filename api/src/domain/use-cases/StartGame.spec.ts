import { expect } from 'chai';

import { GameState, PlayState } from '../entities/Game';
import { GameAlreadyStartedError } from '../errors/GameAlreadyStartedError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { GameService } from '../services/GameService';
import { createGame, createPlayer, createPlayers } from '../tests/creators';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { InMemoryQuestionRepository } from '../tests/repositories/InMemoryQuestionRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';

import { StartGame } from './StartGame';

describe('StartGame', () => {
  const questionRepository = new InMemoryQuestionRepository();
  const choiceRepository = new InMemoryChoiceRepository();
  const gameRepository = new InMemoryGameRepository();
  const playerRepository = new InMemoryPlayerRepository();

  const gameEvents = new StubGameEvents();
  const gameService = new GameService(choiceRepository, playerRepository, gameEvents);

  const useCase = new StartGame(questionRepository, choiceRepository, gameRepository, gameService, gameEvents);

  it('starts a game', async () => {
    const players = createPlayers(4);
    const game = createGame({ players });
    const [questionMaster] = players;
    const turns = 2;

    await useCase.startGame(game, questionMaster, turns);

    expect(game.state).to.eql(GameState.started);
    expect(game.playState).to.eql(PlayState.playersAnswer);
    expect(game.questionMaster).to.eql(questionMaster);
    expect(game.answers).to.eql([]);

    const questions = questionRepository.getQuestions(game);
    const choices = choiceRepository.getChoices(game);

    expect(questions).to.have.length(turns);
    expect(game.question).to.eql(questions?.[0]);
    expect(choices).to.have.length(6);

    for (const player of game.players) {
      expect(player.cards).to.have.length(11);
      expect(gameEvents.getPlayerEvents(player)).to.deep.include({ type: 'CardsDealt', cards: player.cards });
    }

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'GameStarted' });
    expect(gameEvents.getGameEvents(game)).to.deep.include({
      type: 'TurnStarted',
      questionMaster: questionMaster,
      question: game.question,
    });
  });

  it('does not start a game that is not in idle state', async () => {
    const players = createPlayers(4);
    const game = createGame({ state: GameState.started });
    const [questionMaster] = players;

    await expect(useCase.startGame(game, questionMaster, 1)).to.be.rejectedWith(GameAlreadyStartedError);
  });

  it('does not start a game that have less than three players', async () => {
    const game = await createGame({ players: [] });
    const questionMaster = createPlayer();

    await expect(useCase.startGame(game, questionMaster, 1)).to.be.rejectedWith(NotEnoughPlayersError);

    game.players.push(questionMaster);
    game.players.push(createPlayer());

    await expect(useCase.startGame(game, questionMaster, 1)).to.be.rejectedWith(NotEnoughPlayersError);
  });
});
