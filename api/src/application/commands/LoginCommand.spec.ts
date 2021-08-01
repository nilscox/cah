import { expect } from 'chai';

import { Player } from '../../domain/models/Player';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../utils/injector';
import { instanciateStubDependencies } from '../../utils/stubDependencies';

import { LoginHandler } from './LoginCommand';

describe('LoginCommand', () => {
  let playerRepository: InMemoryPlayerRepository;

  let handler: LoginHandler;

  const session = new StubSessionStore();

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ playerRepository } = deps);

    handler = instanciateHandler(LoginHandler, deps);
  });

  const execute = (nick: string) => {
    return handler.execute({ nick }, session);
  };

  it('logs in as a new player', async () => {
    const { id: playerId } = await execute('tok');

    expect(playerId).to.be.a('string');

    expect(await playerRepository.findPlayerByNick('tok')).not.to.be.undefined;
    expect(session.player?.nick).to.eql('tok');
  });

  it('logs in as an existing player', async () => {
    const player = new Player('kot');

    session.player = player;

    await playerRepository.save(player);

    const { id: playerId } = await execute('kot');

    expect(playerId).to.eql(player.id);
    expect(session.player?.nick).to.eql('kot');
  });
});
