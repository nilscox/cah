import { expect } from 'earljs';

import { AlreadyFlushedCardsError } from '../../../domain/errors/AlreadyFlushedCardsError';
import { Player } from '../../../domain/models/Player';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { expectError } from '../../../utils/expectError';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { FlushCardsHandler } from './FlushCardsCommand';

describe('FlushCards', () => {
  let playerRepository: InMemoryPlayerRepository;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let flushCards: FlushCardsHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ playerRepository, publisher, builder } = deps);

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

    expect(player.cards).toBeAnArrayOfLength(11);
    expect(player.cards).not.toBeAnArrayWith(oldCards);
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
    expect(error).toBeAnObjectWith({ player });
  });
});
