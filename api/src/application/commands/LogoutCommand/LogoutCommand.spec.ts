import { expect } from 'chai';

import { Player } from '../../../domain/models/Player';
import { StubSessionStore } from '../../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { LogoutHandler } from './LogoutCommand';

describe('LogoutCommand', () => {
  let handler: LogoutHandler;

  const session = new StubSessionStore();

  beforeEach(() => {
    const deps = instanciateStubDependencies();

    handler = instanciateHandler(LogoutHandler, deps);
  });

  const execute = () => {
    return handler.execute({}, session);
  };

  it('logs out', async () => {
    session.player = new Player('tok');

    await execute();
    expect(session.player?.nick).to.be.undefined;
  });
});
