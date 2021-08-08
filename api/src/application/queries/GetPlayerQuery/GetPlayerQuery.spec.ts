import { expect } from 'chai';

import { Choice } from '../../../domain/models/Choice';
import { Player } from '../../../domain/models/Player';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubSessionStore } from '../../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { GetPlayerHandler } from './GetPlayerQuery';

describe('GetPlayerQuery', () => {
  let playerRepository: InMemoryPlayerRepository;
  let builder: GameBuilder;

  let handler: GetPlayerHandler;

  const session = new StubSessionStore();

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ playerRepository, builder } = deps);

    handler = instanciateHandler(GetPlayerHandler, deps);
  });

  it('fetches a player', async () => {
    const player = new Player('tok');

    await playerRepository.save(player);

    const result = await handler.execute({ playerId: player.id }, session);

    expect(result).to.eql({
      id: player.id,
      nick: 'tok',
      isConnected: false,
    });
  });

  it('fetches the current player', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.players[0];

    player.cards = [new Choice('text')];
    session.player = player;
    await playerRepository.save(player);

    const result = await handler.execute({ playerId: player.id }, session);

    expect(result).to.eql({
      id: player.id,
      gameId: game.id,
      nick: player.nick,
      isConnected: false,
      cards: [{ id: player.cards[0].id, text: 'text' }],
      hasFlushed: false,
    });
  });
});
