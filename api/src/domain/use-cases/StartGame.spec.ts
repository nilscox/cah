import { expect } from 'chai';
import { Container } from 'typedi';

import { GameState, PlayState } from '../entities/Game';
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

    const questions = questionRepository.getQuestions();
    const choices = choiceRepository.findAll();

    expect(questions).to.have.length(turns);
    expect(game.question).to.eql(questions?.[0]);
    expect(choices).to.have.length(50);

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

  it('select the appropriate number of questions and choices for the whole game', async () => {
    const players = createPlayers(5);
    const game = createGame({ players });
    const [questionMaster] = players;
    const turns = 4;

    // 9 blanks
    externalData.setQuestions([
      createQuestion(),
      createQuestion({ blanks: [1, 2, 3] }),
      createQuestion({ blanks: [0] }),
      createQuestion({ blanks: [9, 8, 7, 6] }),
    ]);

    await useCase.startGame(game, questionMaster, turns);

    expect(questionRepository.getQuestions()).to.have.length(4);
    expect(choiceRepository.findAll()).to.have.length(91);
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
