import { expect } from 'chai';

import { PlayState } from '../entities/Game';
import { AlreadyAnsweredError } from '../errors/AlreadyAnsweredError';
import { IncorrectNumberOfChoicesError } from '../errors/IncorrectNumberOfChoicesError';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { IsQuestionMasterError } from '../errors/IsQuestionMasterError';
import { GameService } from '../services/GameService';
import { createQuestion, createStartedGame } from '../tests/creators';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';
import { StubRandomService } from '../tests/stubs/StubRandomService';

import { GiveChoicesSelection } from './GiveChoicesSelection';

describe('GiveChoicesSelection', () => {
  const playerRepository = new InMemoryPlayerRepository();
  const gameRepository = new InMemoryGameRepository();
  const choiceRepository = new InMemoryChoiceRepository();

  const gameEvents = new StubGameEvents();
  const gameService = new GameService(choiceRepository, playerRepository, gameEvents);
  const randomService = new StubRandomService();

  const useCase = new GiveChoicesSelection(playerRepository, gameRepository, gameService, randomService, gameEvents);

  it('validates a single choice for the current turn', async () => {
    const game = createStartedGame();
    const [player] = game.playersExcludingQM;
    const selection = [player.cards[0]];

    await useCase.giveChoicesSelection(game, player, selection);

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

    await useCase.giveChoicesSelection(game, player, selection);

    expect(player.cards).to.have.length(8);
    expect(player.cards).not.to.contain(selection);

    expect(game.answers).to.have.length(1);
    expect(game.answers?.[0].player).to.eql(player);
    expect(game.answers?.[0].choices).to.eql(selection);
  });

  it('enters in question master selection play state when the last player answered', async () => {
    const game = createStartedGame();
    const { playersExcludingQM: players } = game;

    for (const player of players) {
      expect(game.playState).to.eql(PlayState.playersAnswer);

      await useCase.giveChoicesSelection(game, player, [player.cards[0]]);
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

      const err = await expect(useCase.giveChoicesSelection(game, player, [player.cards[0]])).to.be.rejectedWith(
        InvalidPlayStateError,
      );

      expect(err).to.have.property('expected', PlayState.playersAnswer);
    }
  });

  it('does not validate choices when the player is the question master', async () => {
    const game = createStartedGame();
    const questionMaster = game.questionMaster!;
    const selection = [questionMaster.cards[0]];

    await expect(useCase.giveChoicesSelection(game, questionMaster, selection)).to.be.rejectedWith(
      IsQuestionMasterError,
    );
  });

  it('does not validate choices when the player has already answered', async () => {
    const game = createStartedGame();
    const player = game.playersExcludingQM[0];
    const selection1 = [player.cards[0]];
    const selection2 = [player.cards[1]];

    await useCase.giveChoicesSelection(game, player, selection1);

    await expect(useCase.giveChoicesSelection(game, player, selection2)).to.be.rejectedWith(AlreadyAnsweredError);
  });

  it('does not validate choices that the player does not own', async () => {
    const game = createStartedGame();
    const [player1, player2] = game.playersExcludingQM;
    const selection = [player1.cards[0], player2.cards[0]];

    await expect(useCase.giveChoicesSelection(game, player2, selection)).to.be.rejectedWith(
      InvalidChoicesSelectionError,
    );
  });

  it('does not validate an incorrect number of choices', async () => {
    const game = createStartedGame();
    const player = game.playersExcludingQM[0];

    game.question = createQuestion({ blanks: [1, 2] });

    for (const selection of [[], [player.cards[0]], player.cards]) {
      await expect(useCase.giveChoicesSelection(game, player, selection)).to.be.rejectedWith(
        IncorrectNumberOfChoicesError,
      );
    }
  });
});
