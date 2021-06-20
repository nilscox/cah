import { expect } from 'chai';
import { Container } from 'typedi';

import { GameState, PlayState, StartedGame } from '../entities/Game';
import { Player } from '../entities/Player';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEventsToken } from '../interfaces/GameEvents';
import { GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { TurnRepositoryToken } from '../interfaces/TurnRepository';
import { createAnswers, createChoices, createQuestion, createStartedGame } from '../tests/creators';
import { inject } from '../tests/inject';
import { InMemoryAnswerRepository } from '../tests/repositories/InMemoryAnswerRepository';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { InMemoryQuestionRepository } from '../tests/repositories/InMemoryQuestionRepository';
import { InMemoryTurnRepository } from '../tests/repositories/InMemoryTurnRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';

import { NextTurn } from './NextTurn';

describe('NextTurn', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let questionRepository: InMemoryQuestionRepository;
  let choiceRepository: InMemoryChoiceRepository;
  let turnRepository: InMemoryTurnRepository;
  let answerRepository: InMemoryAnswerRepository;

  let gameEvents: StubGameEvents;

  let useCase: NextTurn;

  beforeEach(() => {
    Container.reset();

    /* eslint-disable @typescript-eslint/no-unused-vars */

    gameRepository = inject(GameRepositoryToken, new InMemoryGameRepository());
    playerRepository = inject(PlayerRepositoryToken, new InMemoryPlayerRepository());
    questionRepository = inject(QuestionRepositoryToken, new InMemoryQuestionRepository());
    choiceRepository = inject(ChoiceRepositoryToken, new InMemoryChoiceRepository());
    turnRepository = inject(TurnRepositoryToken, new InMemoryTurnRepository());
    answerRepository = inject(AnswerRepositoryToken, new InMemoryAnswerRepository());

    gameEvents = inject(GameEventsToken, new StubGameEvents());

    /* eslint-enable @typescript-eslint/no-unused-vars */

    useCase = Container.get(NextTurn);
  });

  const playersExcludingQM = (game: StartedGame) => {
    return game.players.filter((player) => !player.is(game.questionMaster));
  };

  const initRepositories = (game: StartedGame) => {
    gameRepository.set([game]);
    playerRepository.set(game.players);
    choiceRepository.set(game.players.map(({ cards }) => cards).flat());
  };

  const initializeGame = () => {
    const game = createStartedGame({ playState: PlayState.endOfTurn });

    initRepositories(game);
    choiceRepository.createChoices(game, createChoices(3));

    for (const player of playersExcludingQM(game)) {
      player.cards.splice(0, 1);
    }

    game.winner = playersExcludingQM(game)[0];

    return game;
  };

  const createAnswerForPlayers = async (game: StartedGame, players: Player[]) => {
    const answers = createAnswers(players.length, (n) => ({ player: players[n] }));

    answerRepository.set(answers);

    for (const answer of answers) {
      await gameRepository.addAnswer(game, answer);
    }

    return answers;
  };

  const getGame = (gameId: number) => {
    return gameRepository.findOne(gameId) as Promise<StartedGame>;
  };

  it('ends the current turn and starts the next one', async () => {
    let game = initializeGame();
    const { players, winner, questionMaster } = game;

    createAnswerForPlayers(game, playersExcludingQM(game));

    const nextQuestion = createQuestion();
    questionRepository.createQuestions(game, [nextQuestion]);

    await useCase.nextTurn(game.id);

    game = await getGame(game.id);

    expect(game.playState).to.eql(PlayState.playersAnswer);
    expect(game.question).to.eql(nextQuestion);
    expect(game.questionMaster).to.eql(winner);
    expect(game.winner).to.be.undefined;

    expect(await gameRepository.getAnswers(game)).to.have.length(0);

    for (const player of game.players) {
      expect(player.cards).to.have.length(11);
    }

    const turns = turnRepository.get();

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
    let game = initializeGame();

    createAnswerForPlayers(game, playersExcludingQM(game));

    await useCase.nextTurn(game.id);

    game = await getGame(game.id);

    expect(game.state).to.eql(GameState.finished);
    expect(game.playState).to.be.undefined;
    expect(game.questionMaster).to.be.undefined;
    expect(game.question).to.be.undefined;
    expect(game.winner).to.be.undefined;

    expect(await gameRepository.getAnswers(game)).to.have.length(0);

    const turns = turnRepository.get();

    expect(turns).to.have.length(1);

    for (const player of game.players) {
      expect(player.cards).to.have.length(0);
    }

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'TurnEnded', turn: turns[0] });
    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'GameFinished' });
  });

  it('does not end the current turn when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.questionMasterSelection]) {
      const game = createStartedGame({ playState });

      initRepositories(game);
      choiceRepository.createChoices(game, createChoices(3));

      const err = await expect(useCase.nextTurn(game.id)).to.be.rejectedWith(InvalidPlayStateError);

      expect(err).to.have.property('expected', PlayState.endOfTurn);
    }
  });
});
