import { expect } from 'chai';

import { PlayState } from '../../../../shared/enums';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubExternalData } from '../../infrastructure/stubs/StubExternalData';
import { StubRTCManager } from '../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { GameBuilder } from '../../utils/GameBuilder';
import { DtoMapperService } from '../services/DtoMapperService';

import { GetTurnsHandler } from './GetTurnsQuery';

describe('GetTurnsQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;
  let rtcManager: StubRTCManager;
  let mapper: DtoMapperService;
  let session: StubSessionStore;

  let handler: GetTurnsHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    externalData = new StubExternalData();
    rtcManager = new StubRTCManager();
    mapper = new DtoMapperService(rtcManager);
    session = new StubSessionStore();

    handler = new GetTurnsHandler(gameRepository, mapper);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  it("fetches a game's turns", async () => {
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();
    const turn = game.currentTurn;

    await gameRepository.addTurn(game.id, turn);

    const turns = await handler.execute({ gameId: game.id }, session);

    expect(turns).to.eql([
      {
        number: 0,
        question: turn.question.toJSON(),
        answers: [turn.answers[0].toJSON(), turn.answers[1].toJSON()],
        winner: turn.winner.nick,
      },
    ]);
  });
});
