import { expect } from 'chai';

import { Choice } from '../../domain/models/Choice';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubExternalData } from '../../infrastructure/stubs/StubExternalData';
import { StubRTCManager } from '../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { GameBuilder } from '../../utils/GameBuilder';
import { DtoMapperService } from '../services/DtoMapperService';

import { GetPlayerHandler } from './GetPlayerQuery';

describe('GetPlayerQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;
  let rtcManager: StubRTCManager;
  let mapper: DtoMapperService;
  let session: StubSessionStore;

  let handler: GetPlayerHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    externalData = new StubExternalData();
    rtcManager = new StubRTCManager();
    mapper = new DtoMapperService(rtcManager);
    session = new StubSessionStore();

    handler = new GetPlayerHandler(playerRepository, mapper);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
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
    });
  });
});
