import { expect } from 'chai';

import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubExternalData } from '../../infrastructure/stubs/StubExternalData';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { GameBuilder } from '../../utils/GameBuilder';

import { GetPlayerHandler } from './GetPlayerQuery';

describe('GetPlayerQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;

  let builder: GameBuilder;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    externalData = new StubExternalData();

    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  it('fetches a player', async () => {
    const playerRepository = new InMemoryPlayerRepository();
    const session = new StubSessionStore();
    const handler = new GetPlayerHandler(playerRepository, gameRepository);

    const player = new Player('tok');

    playerRepository.save(player);

    const result = await handler.execute({ playerId: player.id }, session);

    expect(result).to.have.property('nick', 'tok');
    expect(result).not.to.have.property('cards');
  });

  it('fetches the current player', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.players[0];
    const session = new StubSessionStore();
    const handler = new GetPlayerHandler(playerRepository, gameRepository);

    session.player = player;

    const result = await handler.execute({ playerId: player.id }, session);

    expect(result).to.have.property('gameId', game.id);
    expect(result).to.have.property('cards').that.have.length(11);
  });
});
