import { expect } from 'earljs';

import { PlayState } from '../../../../../shared/enums';
import { AlreadyFlushedCardsError } from '../../../domain/errors/AlreadyFlushedCardsError';
import { CannotFlushCardsError } from '../../../domain/errors/CannotFlushCardsError';
import { InvalidPlayStateError } from '../../../domain/errors/InvalidPlayStateError';
import { Player } from '../../../domain/models/Player';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { expectError } from '../../../utils/expectError';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { FlushCardsHandler } from './FlushCardsCommand';

describe('FlushCards', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let flushCards: FlushCardsHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, publisher, builder } = deps);

    flushCards = instanciateHandler(FlushCardsHandler, deps);
  });

  const execute = async (player: Player) => {
    await flushCards.execute({}, { player });

    playerRepository.reload(player);
  };

  it("flushes the player's cards", async () => {
    const game = await builder.addPlayers().start().get();

    const player = game.players[0];
    const oldCards = player.cards.slice();

    await execute(player);

    await playerRepository.reload(player);

    expect(player.cards).toBeAnArrayOfLength(11);
    expect(player.cards).not.toBeAContainerWith(...oldCards);
  });

  it('notifies the player that he received the new cards', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.players[0];

    await execute(player);

    expect(publisher.lastEvent).toBeAnObjectWith({ type: 'CardsDealt', player, cards: player.cards });
  });

  it('prevents the player to flush his cards twice', async () => {
    const game = await builder.addPlayers().start().get();

    const player = game.players[0];
    player.cards.slice();

    await expect(execute(player)).not.toBeRejected();

    const error = await expectError(execute(player), AlreadyFlushedCardsError);
    expect(error).toBeAnObjectWith({ player });
  });

  it('prevents the player to flush his cards when the play state is not players answer', async () => {
    for (const playState of [PlayState.questionMasterSelection, PlayState.endOfTurn]) {
      const game = await builder.addPlayers().start().play(playState).get();
      const player = game.playersExcludingQM[0];

      const error = await expectError(execute(player), InvalidPlayStateError);
      expect(error).toBeAnObjectWith({ expected: PlayState.playersAnswer, actual: playState });
    }
  });

  it('prevents the player to flush his cards after choice selection', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];

    game.addAnswer(player, player.getFirstCards(game.question.numberOfBlanks), (array) => array);

    await gameRepository.save(game);
    await playerRepository.save(player);

    await expectError(execute(player), CannotFlushCardsError, 'Cannot flush cards after an answer was submitted');
  });
});
