import { expect } from 'chai';
import { Container } from 'typedi';

import { Answer } from '../entities/Answer';
import { PlayState } from '../entities/Game';
import { InvalidPlayStateError } from '../errors/InvalidPlayStateError';
import { IsNotQuestionMasterError } from '../errors/IsNotQuestionMasterError';
import { ChoiceRepositoryToken } from '../interfaces/ChoiceRepository';
import { GameEventsToken } from '../interfaces/GameEvents';
import { GameRepositoryToken } from '../interfaces/GameRepository';
import { PlayerRepositoryToken } from '../interfaces/PlayerRepository';
import { createStartedGame } from '../tests/creators';
import { InMemoryChoiceRepository } from '../tests/repositories/InMemoryChoiceRepository';
import { InMemoryGameRepository } from '../tests/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../tests/repositories/InMemoryPlayerRepository';
import { StubGameEvents } from '../tests/stubs/StubGameEvents';

import { PickWinningAnswer } from './PickWinningAnswer';

describe('PickWinningAnswer', () => {
  const gameRepository = new InMemoryGameRepository();
  const playerRepository = new InMemoryPlayerRepository();
  const choiceRepository = new InMemoryChoiceRepository();

  const gameEvents = new StubGameEvents();

  let useCase: PickWinningAnswer;

  before(() => {
    Container.reset();

    Container.set(PlayerRepositoryToken, playerRepository);
    Container.set(GameRepositoryToken, gameRepository);
    Container.set(ChoiceRepositoryToken, choiceRepository);

    Container.set(GameEventsToken, gameEvents);

    useCase = Container.get(PickWinningAnswer);
  });

  it('selects the winning answer', async () => {
    const game = await createStartedGame({ playState: PlayState.questionMasterSelection });
    const questionMaster = game.questionMaster!;
    const players = game.playersExcludingQM;

    game.answers = players.map((player) => Object.assign(new Answer(), { player }));

    await useCase.pickWinningAnswer(game, questionMaster, 0);

    expect(game.playState).to.eql(PlayState.endOfTurn);
    expect(game.winner).to.eql(players[0]);

    expect(gameEvents.getGameEvents(game)).to.deep.include({
      type: 'WinnerSelected',
      answers: game.answers,
      winner: players[0],
    });
  });

  it('does not select a winner when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.endOfTurn]) {
      const game = createStartedGame({ playState });
      const players = game.playersExcludingQM;
      const [player] = players;

      const err = await expect(useCase.pickWinningAnswer(game, player, 0)).to.be.rejectedWith(InvalidPlayStateError);

      expect(err).to.have.property('expected', PlayState.questionMasterSelection);
    }
  });

  it('does not select a winner when the player is not the question master', async () => {
    const game = await createStartedGame({ playState: PlayState.questionMasterSelection });
    const players = game.playersExcludingQM;

    await expect(useCase.pickWinningAnswer(game, players[0], 0)).to.be.rejectedWith(IsNotQuestionMasterError);
  });
});
