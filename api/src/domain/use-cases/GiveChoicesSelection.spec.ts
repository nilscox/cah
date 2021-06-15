import { expect } from 'chai';
import { Container } from 'typedi';

import { PlayState, StartedGame } from '../entities/Game';
import { AlreadyAnsweredError } from '../errors/AlreadyAnsweredError';
import { IncorrectNumberOfChoicesError } from '../errors/IncorrectNumberOfChoicesError';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { IsQuestionMasterError } from '../errors/IsQuestionMasterError';
import { AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEventsToken } from '../interfaces/GameEvents';
import { GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { RandomServiceToken } from '../services/RandomService';
import { createAnswer, createAnswers, createQuestion, createStartedGame } from '../tests/creators';
import { inject } from '../tests/inject';
import { InMemoryAnswerRepository } from '../tests/repositories/InMemoryAnswerRepository';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';
import { StubRandomService } from '../tests/stubs/StubRandomService';

import { GiveChoicesSelection } from './GiveChoicesSelection';

describe.only('GiveChoicesSelection', () => {
  let playerRepository: InMemoryPlayerRepository;
  let gameRepository: InMemoryGameRepository;
  let choiceRepository: InMemoryChoiceRepository;
  let answerRepository: InMemoryAnswerRepository;

  let gameEvents: StubGameEvents;
  let randomService: StubRandomService;

  let useCase: GiveChoicesSelection;

  beforeEach(() => {
    Container.reset();

    /* eslint-disable @typescript-eslint/no-unused-vars */

    playerRepository = inject(PlayerRepositoryToken, new InMemoryPlayerRepository());
    gameRepository = inject(GameRepositoryToken, new InMemoryGameRepository());
    choiceRepository = inject(ChoiceRepositoryToken, new InMemoryChoiceRepository());
    answerRepository = inject(AnswerRepositoryToken, new InMemoryAnswerRepository());

    gameEvents = inject(GameEventsToken, new StubGameEvents());
    randomService = inject(RandomServiceToken, new StubRandomService());

    /* eslint-enable @typescript-eslint/no-unused-vars */

    useCase = Container.get(GiveChoicesSelection);
  });

  const getIds = <T extends { id: number }>(item: T[]): number[] => {
    return item.map(({ id }) => id);
  };

  const playersExcludingQM = (game: StartedGame) => {
    return game.players.filter((player) => !player.is(game.questionMaster));
  };

  const initRepositories = (game: StartedGame) => {
    gameRepository.save(game);
    playerRepository.setPlayers(game.players);
    answerRepository.setAnswers([]);
    choiceRepository.setChoices(game.players.map(({ cards }) => cards).flat());
  };

  it('validates a single choice for the current turn', async () => {
    const game = createStartedGame();

    initRepositories(game);

    const [player] = playersExcludingQM(game);
    const selection = [player.cards[0]];

    await useCase.giveChoicesSelection(game.id, player.id, getIds(selection));

    expect(player.cards).to.have.length(10);
    expect(player.cards).not.to.contain(selection);

    const answers = await answerRepository.findForGame(game);

    expect(answers).to.have.length(1);
    expect(answers?.[0].player).to.eql(player);
    expect(answers?.[0].choices).to.eql(selection);

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'PlayerAnswered', player });
  });

  it('validates multiple choices for the current turn', async () => {
    const game = createStartedGame();

    initRepositories(game);

    const [player] = playersExcludingQM(game);
    const selection = [player.cards[1], player.cards[5], player.cards[3]];

    game.question = createQuestion({ blanks: [1, 2, 3] });

    await useCase.giveChoicesSelection(game.id, player.id, getIds(selection));

    expect(player.cards).to.have.length(8);
    expect(player.cards).not.to.contain(selection);

    const answers = await answerRepository.findForGame(game);

    expect(answers).to.have.length(1);
    expect(answers?.[0].player).to.eql(player);
    expect(answers?.[0].choices).to.have.members(selection);
  });

  it('enters in question master selection play state when the last player answered', async () => {
    const game = createStartedGame();
    const [player, ...players] = playersExcludingQM(game);
    const selection = [player.cards[0]];

    initRepositories(game);

    const answers = createAnswers(players.length, (n) => ({ player: players[n] }));
    answerRepository.setAnswers(answers);

    for (const answer of answers) {
      await answerRepository.setGame(answer, game);
    }

    await useCase.giveChoicesSelection(game.id, player.id, getIds(selection));

    const savedGame = (await gameRepository.findOne(game.id)) as StartedGame;

    expect(savedGame.playState).to.eql(PlayState.questionMasterSelection);

    const savedAnswers = await answerRepository.findForGame(game);

    expect(savedAnswers).to.have.length([player, ...players].length);
    expect(savedAnswers[savedAnswers.length - 1].player.is(player)).to.be.true;

    expect(gameEvents.getGameEvents(game)).to.deep.include({
      type: 'AllPlayersAnswered',
      answers: savedAnswers,
    });
  });

  it('does not validate choices when the game play state is invalid', async () => {
    for (const playState of [PlayState.questionMasterSelection, PlayState.endOfTurn]) {
      const game = createStartedGame({ playState });
      const [player] = game.players;

      initRepositories(game);

      const err = await expect(
        useCase.giveChoicesSelection(game.id, player.id, [player.cards[0].id]),
      ).to.be.rejectedWith(InvalidPlayStateError);

      expect(err).to.have.property('expected', PlayState.playersAnswer);
    }
  });

  it('does not validate choices when the player is the question master', async () => {
    const game = createStartedGame();
    const questionMaster = game.questionMaster!;
    const selection = [questionMaster.cards[0]];

    initRepositories(game);

    await expect(useCase.giveChoicesSelection(game.id, questionMaster.id, getIds(selection))).to.be.rejectedWith(
      IsQuestionMasterError,
    );
  });

  it('does not validate choices when the player has already answered', async () => {
    const game = createStartedGame();
    const [player] = playersExcludingQM(game);

    initRepositories(game);

    const answer = createAnswer({ player });
    answerRepository.setAnswers([answer]);
    await answerRepository.setGame(answer, game);

    await expect(useCase.giveChoicesSelection(game.id, player.id, [])).to.be.rejectedWith(AlreadyAnsweredError);
  });

  it('does not validate choices that the player does not own', async () => {
    const game = createStartedGame();
    const [player1, player2] = playersExcludingQM(game);
    const selection = [player1.cards[0], player2.cards[0]];

    initRepositories(game);

    await expect(useCase.giveChoicesSelection(game.id, player2.id, getIds(selection))).to.be.rejectedWith(
      InvalidChoicesSelectionError,
    );
  });

  it('does not validate an incorrect number of choices', async () => {
    const game = createStartedGame();
    const [player] = playersExcludingQM(game);

    initRepositories(game);

    game.question = createQuestion({ blanks: [1, 2] });

    for (const selection of [[], [player.cards[0]], player.cards]) {
      await expect(useCase.giveChoicesSelection(game.id, player.id, getIds(selection))).to.be.rejectedWith(
        IncorrectNumberOfChoicesError,
      );
    }
  });
});
