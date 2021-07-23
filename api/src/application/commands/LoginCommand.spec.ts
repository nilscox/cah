import { expect } from 'chai';

import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubRTCManager } from '../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { DtoMapperService } from '../services/DtoMapperService';

import { LoginHandler } from './LoginCommand';

describe('LoginCommand', () => {
  it('logs in as a new player', async () => {
    const playerRepository = new InMemoryPlayerRepository();
    const rtcManager = new StubRTCManager();
    const mapper = new DtoMapperService(rtcManager);
    const session = new StubSessionStore();
    const handler = new LoginHandler(playerRepository, mapper);

    const { id: playerId } = await handler.execute({ nick: 'tok' }, session);

    expect(playerId).to.be.a('string');

    expect(await playerRepository.findPlayerByNick('tok')).not.to.be.undefined;
    expect(session.player?.nick).to.eql('tok');
  });
});
