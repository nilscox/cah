import { expect } from 'chai';
import { Container } from 'typedi';

import { PlayState } from '../entities/Game';
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
import { createQuestion, createStartedGame } from '../tests/creators';
import { inject } from '../tests/inject';
import { InMemoryAnswerRepository } from '../tests/repositories/InMemoryAnswerRepository';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';
import { StubRandomService } from '../tests/stubs/StubRandomService';

import { GiveChoicesSelection } from './GiveChoicesSelection';

describe('GiveChoicesSelection', () => {
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

  it('validates a single choice for the current turn', async () => {
    const game = createStartedGame();
    const [player] = game.playersExcludingQM;
    const selection = [player.cards[0]];

    await useCase.giveChoicesSelection(game, player, getIds(selection));

    expect(player.cards).to.have.length(10);
    expect(player.cards).not.to.contain(selection);

    expect(game.answers).to.have.length(1);
    expect(game.answers?.[0].player).to.eql(player);
    expect(game.answers?.[0].choices).to.eql(selection);

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'PlayerAnswered', player });
  });

  it('validates multiple choices for the current turn', async () => {
    const game = createStartedGame();
    const [player] = game.playersExcludingQM;
    const selection = [player.cards[1], player.cards[5], player.cards[3]];

    game.question = createQuestion({ blanks: [1, 2, 3] });

    await useCase.giveChoicesSelection(game, player, getIds(selection));

    expect(player.cards).to.have.length(8);
    expect(player.cards).not.to.contain(selection);

    expect(game.answers).to.have.length(1);
    expect(game.answers?.[0].player).to.eql(player);
    expect(game.answers?.[0].choices).to.have.members(selection);
  });

  it('enters in question master selection play state when the last player answered', async () => {
    const game = createStartedGame();
    const { playersExcludingQM: players } = game;

    for (const player of players) {
      expect(game.playState).to.eql(PlayState.playersAnswer);

      await useCase.giveChoicesSelection(game, player, [player.cards[0].id]);
    }

    expect(game.playState).to.eql(PlayState.questionMasterSelection);
    expect(game.answers).to.have.length(players.length);
    expect(game.answers?.[0].player).to.eql(players[players.length - 1]);

    expect(gameEvents.getGameEvents(game)?.filter((event) => event.type === 'PlayerAnswered')).to.have.length(
      players.length,
    );

    expect(gameEvents.getGameEvents(game)).to.deep.include({ type: 'AllPlayersAnswered', answers: game.answers });
  });

  it('does not validate choices when the game play state is invalid', async () => {
    for (const playState of [PlayState.questionMasterSelection, PlayState.endOfTurn]) {
      const game = createStartedGame({ playState });
      const [player] = game.players;

      const err = await expect(useCase.giveChoicesSelection(game, player, [player.cards[0].id])).to.be.rejectedWith(
        InvalidPlayStateError,
      );

      expect(err).to.have.property('expected', PlayState.playersAnswer);
    }
  });

  it('does not validate choices when the player is the question master', async () => {
    const game = createStartedGame();
    const questionMaster = game.questionMaster!;
    const selection = [questionMaster.cards[0]];

    await expect(useCase.giveChoicesSelection(game, questionMaster, getIds(selection))).to.be.rejectedWith(
      IsQuestionMasterError,
    );
  });

  it('does not validate choices when the player has already answered', async () => {
    const game = createStartedGame();
    const player = game.playersExcludingQM[0];
    const selection = [player.cards[0]];

    await useCase.giveChoicesSelection(game, player, getIds(selection));

    await expect(useCase.giveChoicesSelection(game, player, [])).to.be.rejectedWith(AlreadyAnsweredError);
  });

  it('does not validate choices that the player does not own', async () => {
    const game = createStartedGame();
    const [player1, player2] = game.playersExcludingQM;
    const selection = [player1.cards[0], player2.cards[0]];

    await expect(useCase.giveChoicesSelection(game, player2, getIds(selection))).to.be.rejectedWith(
      InvalidChoicesSelectionError,
    );
  });

  it('does not validate an incorrect number of choices', async () => {
    const game = createStartedGame();
    const player = game.playersExcludingQM[0];

    game.question = createQuestion({ blanks: [1, 2] });

    for (const selection of [[], [player.cards[0]], player.cards]) {
      await expect(useCase.giveChoicesSelection(game, player, getIds(selection))).to.be.rejectedWith(
        IncorrectNumberOfChoicesError,
      );
    }
  });
});
