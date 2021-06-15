import { expect } from 'chai';
import { Container } from 'typedi';

import { PlayState, StartedGame } from '../entities/Game';
import { Player } from '../entities/Player';
import { AnswerNotFoundError } from '../errors/AnswerNotFoundError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { IsNotQuestionMasterError } from '../errors/IsNotQuestionMasterError';
import { AnswerRepositoryToken } from '../interfaces/AnswerRepository';
import { ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEventsToken } from '../interfaces/GameEvents';
import { GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { createAnswers, createStartedGame } from '../tests/creators';
import { inject } from '../tests/inject';
import { InMemoryAnswerRepository } from '../tests/repositories/InMemoryAnswerRepository';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';

import { PickWinningAnswer } from './PickWinningAnswer';

describe('PickWinningAnswer', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let choiceRepository: InMemoryChoiceRepository;
  let answerRepository: InMemoryAnswerRepository;

  let gameEvents: StubGameEvents;

  let useCase: PickWinningAnswer;

  beforeEach(() => {
    Container.reset();

    /* eslint-disable @typescript-eslint/no-unused-vars */

    playerRepository = inject(PlayerRepositoryToken, new InMemoryPlayerRepository());
    gameRepository = inject(GameRepositoryToken, new InMemoryGameRepository());
    choiceRepository = inject(ChoiceRepositoryToken, new InMemoryChoiceRepository());
    answerRepository = inject(AnswerRepositoryToken, new InMemoryAnswerRepository());

    gameEvents = inject(GameEventsToken, new StubGameEvents());

    /* eslint-enable @typescript-eslint/no-unused-vars */

    useCase = Container.get(PickWinningAnswer);
  });

  const playersExcludingQM = (game: StartedGame) => {
    return game.players.filter((player) => !player.is(game.questionMaster));
  };

  const initRepositories = (game: StartedGame) => {
    gameRepository.set([game]);
    playerRepository.set(game.players);
    choiceRepository.set(game.players.map(({ cards }) => cards).flat());
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

  it('selects the winning answer', async () => {
    let game = createStartedGame({ playState: PlayState.questionMasterSelection });
    const { questionMaster } = game;

    initRepositories(game);
    const answers = await createAnswerForPlayers(game, playersExcludingQM(game));

    const { id: answerId, player: winner } = answers[0];

    await useCase.pickWinningAnswer(game.id, questionMaster.id, answerId);

    game = await getGame(game.id);

    expect(game.playState).to.eql(PlayState.endOfTurn);
    expect(game.winner).to.eql(winner);

    expect(gameEvents.getGameEvents(game)).to.deep.include({
      type: 'WinnerSelected',
      answers: answers,
      winner,
    });
  });

  it('does not select an answer when the answerId is not valid', async () => {
    const game = createStartedGame({ playState: PlayState.questionMasterSelection });
    const { questionMaster } = game;

    initRepositories(game);
    await createAnswerForPlayers(game, playersExcludingQM(game));

    await expect(useCase.pickWinningAnswer(game.id, questionMaster.id, 42)).to.be.rejectedWith(AnswerNotFoundError);
  });

  it('does not select a winner when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.endOfTurn]) {
      const game = createStartedGame({ playState });
      const { questionMaster } = game;

      initRepositories(game);
      await createAnswerForPlayers(game, playersExcludingQM(game));

      const err = await expect(useCase.pickWinningAnswer(game.id, questionMaster.id, 0)).to.be.rejectedWith(
        InvalidPlayStateError,
      );

      expect(err).to.have.property('expected', PlayState.questionMasterSelection);
    }
  });

  it('does not select a winner when the player is not the question master', async () => {
    const game = await createStartedGame({ playState: PlayState.questionMasterSelection });
    const [player] = playersExcludingQM(game);

    initRepositories(game);
    await createAnswerForPlayers(game, playersExcludingQM(game));

    await expect(useCase.pickWinningAnswer(game.id, player.id, 0)).to.be.rejectedWith(IsNotQuestionMasterError);
  });
});
