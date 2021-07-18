import { expect } from 'chai';

import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';

import { LoginHandler } from './LoginCommand';

describe('LoginCommand', () => {
  it('logs in as a new player', async () => {
    const playerRepository = new InMemoryPlayerRepository();
    const session = new StubSessionStore();
    const handler = new LoginHandler(playerRepository);

    await handler.execute({ nick: 'tok' }, session);

    expect(await playerRepository.findPlayerByNick('tok')).not.to.be.undefined;
    expect(session.player?.nick).to.eql('tok');
  });
});
