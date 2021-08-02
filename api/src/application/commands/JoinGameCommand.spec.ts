import { expect } from 'chai';

import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubRTCManager } from '../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../utils/injector';
import { instanciateStubDependencies } from '../../utils/stubDependencies';

import { JoinGameHandler } from './JoinGameCommand';

describe('JoinGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let publisher: StubEventPublisher;
  let rtcManager: StubRTCManager;

  let handler: JoinGameHandler;

  let game: Game;
  let player: Player;

  const session = new StubSessionStore();

  beforeEach(async () => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, publisher, rtcManager } = deps);

    handler = instanciateHandler(JoinGameHandler, deps);

    game = new Game();
    await gameRepository.save(game);

    player = session.player = new Player('player');
    await playerRepository.save(player);
  });

  const execute = async () => {
    const result = await handler.execute({ gameCode: game.code }, session);

    gameRepository.reload(game);

    return result;
  };

  it('joins a game', async () => {
    const { id: gameId } = await execute();

    expect(gameId).to.eql(game.id);

    expect(game.players).to.have.length(1);
    expect(game.players[0]).to.eql(player);

    expect(rtcManager.has(game!, player)).to.be.true;
    expect(publisher.lastEvent).to.eql({ type: 'GameJoined', game, player });
  });

  it('prevents a player to join a game when he is already in a game', async () => {
    const otherGame = new Game();

    otherGame.addPlayer(player);
    await gameRepository.save(otherGame);

    const error = await expect(execute()).to.be.rejectedWith(PlayerIsAlreadyInGameError);
    expect(error).to.shallowDeepEqual({ player });
  });
});
