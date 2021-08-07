import { expect } from 'chai';

import { GameState } from '../../../../../shared/enums';
import { InvalidGameStateError } from '../../../domain/errors/InvalidGameStateError';
import { Player } from '../../../domain/models/Player';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { StubRTCManager } from '../../../infrastructure/stubs/StubRTCManager';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { LeaveGameHandler } from './LeaveGameCommand';

describe('LeaveGameCommand', () => {
  let playerRepository: InMemoryPlayerRepository;
  let gameRepository: InMemoryGameRepository;
  let rtcManager: StubRTCManager;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let handler: LeaveGameHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ playerRepository, gameRepository, rtcManager, publisher, builder } = deps);

    handler = instanciateHandler(LeaveGameHandler, deps);
  });

  const execute = (player: Player) => {
    return handler.execute({}, { player });
  };

  it('leaves a game', async () => {
    const game = await builder.addPlayers().start().finish().get();
    const player = game.players[0];

    await execute(player);

    await gameRepository.reload(game);
    await playerRepository.reload(player);

    expect(game.players).to.have.length(2);
    expect(player!.gameId).to.be.undefined;

    expect(rtcManager.has(game, player)).to.be.false;
    expect(publisher.lastEvent).to.eql({ type: 'GameLeft', game, player });
  });

  it('prevents to leave a game when it is not finished', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.players[0];

    const error = await expect(execute(player)).to.be.rejectedWith(InvalidGameStateError);
    expect(error).to.shallowDeepEqual({ expected: GameState.finished, actual: GameState.started });
  });
});
