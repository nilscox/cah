import { expect } from 'chai';

import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubRTCManager } from '../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../utils/injector';
import { instanciateStubDependencies } from '../../utils/stubDependencies';

import { JoinGameHandler } from './JoinGameCommand';

describe('JoinGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let publisher: StubEventPublisher;
  let rtcManager: StubRTCManager;

  let handler: JoinGameHandler;

  let game: Game;
  let player: Player;

  const session = new StubSessionStore();

  beforeEach(async () => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, publisher, rtcManager } = deps);

    handler = instanciateHandler(JoinGameHandler, deps);

    game = new Game();
    await gameRepository.save(game);

    player = session.player = new Player('player');
  });

  const execute = () => {
    return handler.execute({ gameCode: game.code }, session);
  };

  it('joins a game', async () => {
    const { id: gameId } = await execute();

    expect(gameId).to.be.a('string');

    gameRepository.reload(game);

    expect(game.players).to.have.length(1);
    expect(publisher.events).deep.include({ type: 'GameJoined', game, player });
  });

  it('adds the player to the joind game', async () => {
    await execute();

    const game = await gameRepository.findGameForPlayer(player.id);

    expect(rtcManager.has(game!, player)).to.be.true;
  });

  it('disallow a player to join a game when he is already in a game', async () => {
    const otherGame = new Game();

    otherGame.addPlayer(player);
    await gameRepository.save(otherGame);

    const error = await expect(execute()).to.be.rejectedWith(PlayerIsAlreadyInGameError);
    expect(error).to.shallowDeepEqual({ player });
  });
});
