import { expect } from 'chai';

import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubExternalData } from '../../infrastructure/stubs/StubExternalData';
import { GameBuilder } from '../../utils/GameBuilder';
import { GameService } from '../services/GameService';

import { FlushCardsHandler } from './FlushCardsCommand';

describe.skip('FlushCards', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let publisher: StubEventPublisher;
  let externalData: StubExternalData;
  let flushCards: FlushCardsHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    publisher = new StubEventPublisher();
    gameService = new GameService(playerRepository, gameRepository, publisher);
    externalData = new StubExternalData();
    flushCards = new FlushCardsHandler(playerRepository, gameService);
  });

  it("flushes the player's cards", async () => {
    const gameBuilder = new GameBuilder(gameRepository, playerRepository, externalData);
    const game = await gameBuilder.addPlayers().start().get();

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
    const gameBuilder = new GameBuilder(gameRepository, playerRepository, externalData);
    const game = await gameBuilder.addPlayers().start().get();

    const player = game.players[0];
    const session = { player };

    await flushCards.execute({}, session);

    expect(publisher.lastEvent).to.shallowDeepEqual({ type: 'CardsDealt', player, cards: player.cards });
  });
});
