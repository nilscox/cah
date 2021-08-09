import { expect } from 'chai';

import { GameNotFoundError } from '../../../domain/errors/GameNotFoundError';
import { PlayerIsAlreadyInGameError } from '../../../domain/errors/PlayerIsAlreadyInGameError';
import { createGame, Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { StubRTCManager } from '../../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

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

    game = createGame();
    await gameRepository.save(game);

    player = session.player = new Player('player');
    await playerRepository.save(player);
  });

  const execute = async (gameCode = game.code) => {
    const result = await handler.execute({ gameCode }, session);

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

  it('fails when the game is not found', async () => {
    const error = await expect(execute('blah')).to.be.rejectedWith(GameNotFoundError);
    expect(error).to.shallowDeepEqual({ meta: { query: { code: 'blah' } } });
  });

  it('prevents a player to join a game when he is already in a game', async () => {
    const otherGame = createGame();

    otherGame.addPlayer(player);
    await gameRepository.save(otherGame);

    const error = await expect(execute()).to.be.rejectedWith(PlayerIsAlreadyInGameError);
    expect(error).to.shallowDeepEqual({ player });
  });
});
