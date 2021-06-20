import { expect } from 'chai';
import { Container } from 'typedi';

import { Game, GameState, PlayState, StartedGame } from '../entities/Game';
import { GameAlreadyStartedError } from '../errors/GameAlreadyStartedError';
import { NotEnoughPlayersError } from '../errors/NotEnoughPlayersError';
import { ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { ExternalDataToken } from '../interfaces/ExternalData';
import { GameEventsToken } from '../interfaces/GameEvents';
import { GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { QuestionRepositoryToken } from '../interfaces/QuestionRepository';
import { createGame, createPlayer, createPlayers, createQuestion } from '../tests/creators';
import { inject } from '../tests/inject';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryExternalData } from '../tests/repositories/InMemoryExternalData';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { InMemoryQuestionRepository } from '../tests/repositories/InMemoryQuestionRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';

import { StartGame } from './StartGame';

describe('StartGame', () => {
  let questionRepository: InMemoryQuestionRepository;
  let choiceRepository: InMemoryChoiceRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameRepository: InMemoryGameRepository;

  let externalData: InMemoryExternalData;
  let gameEvents: StubGameEvents;

  let useCase: StartGame;

  beforeEach(() => {
    Container.reset();

    /* eslint-disable @typescript-eslint/no-unused-vars */

    questionRepository = inject(QuestionRepositoryToken, new InMemoryQuestionRepository());
    choiceRepository = inject(ChoiceRepositoryToken, new InMemoryChoiceRepository());
    playerRepository = inject(PlayerRepositoryToken, new InMemoryPlayerRepository());
    gameRepository = inject(GameRepositoryToken, new InMemoryGameRepository());

    gameEvents = inject(GameEventsToken, new StubGameEvents());
    externalData = inject(ExternalDataToken, new InMemoryExternalData());

    /* eslint-enable @typescript-eslint/no-unused-vars */

    useCase = Container.get(StartGame);
  });

  const initRepositories = (game: Game) => {
    gameRepository.set([game]);
    playerRepository.set(game.players);
  };

  const getGame = (gameId: number) => {
    return gameRepository.findOne(gameId) as Promise<StartedGame>;
  };

  it('starts a game', async () => {
    const players = createPlayers(4);
    const game = createGame({ players });
    const [questionMaster] = players;
    const turns = 2;

    initRepositories(game);

    await useCase.startGame(game.id, questionMaster.id, turns);

    const startedGame = await getGame(game.id);

    expect(startedGame.state).to.eql(GameState.started);
    expect(startedGame.playState).to.eql(PlayState.playersAnswer);
    expect(startedGame.questionMaster).to.eql(questionMaster);

    expect(await gameRepository.getAnswers(game)).to.eql([]);

    const questions = questionRepository.get();
    const choices = choiceRepository.get();

    expect(questions).to.have.length(turns);
    expect(startedGame.question).to.eql(questions[0]);
    expect(choices).to.have.length(50);

    for (const player of startedGame.players) {
      expect(player.cards).to.have.length(11);
      expect(gameEvents.getPlayerEvents(player)).to.deep.include({ type: 'CardsDealt', cards: player.cards });
    }

    expect(gameEvents.getGameEvents(startedGame)).to.deep.include({ type: 'GameStarted' });
    expect(gameEvents.getGameEvents(startedGame)).to.deep.include({
      type: 'TurnStarted',
      questionMaster: questionMaster,
      question: questions[0],
    });
  });

  it('select the appropriate number of questions and choices for the whole game', async () => {
    const players = createPlayers(5);
    const game = createGame({ players });
    const [questionMaster] = players;
    const turns = 4;

    initRepositories(game);

    // 9 blanks
    externalData.setQuestions([
      createQuestion({ id: 1 }),
      createQuestion({ id: 2, blanks: [1, 2, 3] }),
      createQuestion({ id: 3, blanks: [0] }),
      createQuestion({ id: 4, blanks: [9, 8, 7, 6] }),
    ]);

    await useCase.startGame(game.id, questionMaster.id, turns);

    expect(questionRepository.get()).to.have.length(4);
    expect(choiceRepository.get()).to.have.length(91);
  });

  it('does not start a game that is not in idle state', async () => {
    const players = createPlayers(4);
    const game = createGame({ state: GameState.started, players });
    const [questionMaster] = players;

    initRepositories(game);

    await expect(useCase.startGame(game.id, questionMaster.id, 1)).to.be.rejectedWith(GameAlreadyStartedError);
  });

  it('does not start a game that have less than three players', async () => {
    const questionMaster = createPlayer();
    const game = await createGame({ players: [questionMaster] });

    initRepositories(game);

    await expect(useCase.startGame(game.id, questionMaster.id, 1)).to.be.rejectedWith(NotEnoughPlayersError);

    game.players.push(createPlayer());
    playerRepository.set(game.players);

    await expect(useCase.startGame(game.id, questionMaster.id, 1)).to.be.rejectedWith(NotEnoughPlayersError);
  });
});
