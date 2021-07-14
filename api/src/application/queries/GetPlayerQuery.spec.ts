import { expect } from 'chai';

import { Choice } from '../../domain/models/Choice';
import { Player } from '../../domain/models/Player';
import { InMemoryPlayerRepository } from '../../infrastructure/repositories/InMemoryPlayerRepository';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';

import { GetPlayerHandler } from './GetPlayerQuery';

describe('GetPlayerQuery', () => {
  it('fetches a player', async () => {
    const playerRepository = new InMemoryPlayerRepository();
    const session = new StubSessionStore();
    const handler = new GetPlayerHandler(playerRepository);

    const player = new Player('tok');

    playerRepository.save(player);

    const result = await handler.execute({ playerId: player.id }, session);

    expect(result).to.have.property('nick', 'tok');
    expect(result).not.to.have.property('cards');
  });

  it('fetches the current player', async () => {
    const playerRepository = new InMemoryPlayerRepository();
    const session = new StubSessionStore();
    const handler = new GetPlayerHandler(playerRepository);

    const player = new Player('tok');

    player.addCards([new Choice('choice')]);

    playerRepository.save(player);
    session.player = player;

    const result = await handler.execute({ playerId: player.id }, session);

    expect(result).to.have.property('cards').that.have.length(1);
  });
});
