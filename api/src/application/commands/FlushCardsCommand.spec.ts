import { expect } from 'chai';

import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { GameBuilder } from '../../utils/GameBuilder';
import { instanciateHandler } from '../../utils/injector';
import { instanciateStubDependencies } from '../../utils/stubDependencies';

import { FlushCardsHandler } from './FlushCardsCommand';

describe.skip('FlushCards', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let flushCards: FlushCardsHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, publisher, builder } = deps);

    flushCards = instanciateHandler(FlushCardsHandler, deps);
  });

  it("flushes the player's cards", async () => {
    const game = await builder.addPlayers().start().get();

    const player = game.players[0];
    const oldCards = player.cards.slice();
    const session = { player };

    await flushCards.execute({}, session);

    gameRepository.reload(game);
    playerRepository.reload(player);

    expect(player.cards).to.have.length(11);

    for (const card of player.cards) {
      expect(oldCards.map(({ id }) => id)).not.to.include(card.id);
    }
  });

  it('notifies the player that he received the new cards', async () => {
    const game = await builder.addPlayers().start().get();

    const player = game.players[0];
    const session = { player };

    await flushCards.execute({}, session);

    expect(publisher.lastEvent).to.shallowDeepEqual({ type: 'CardsDealt', player, cards: player.cards });
  });
});
