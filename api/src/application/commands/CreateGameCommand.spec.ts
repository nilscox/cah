import { expect } from 'chai';

import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubRTCManager } from '../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';
import { GameService } from '../services/GameService';

import { CreateGameHandler } from './CreateGameCommand';

describe('CreateGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let publisher: StubEventPublisher;
  let rtcManager: StubRTCManager;

  let handler: CreateGameHandler;

  let session: StubSessionStore;
  let player: Player;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    publisher = new StubEventPublisher();
    gameService = new GameService(playerRepository, gameRepository, publisher);
    rtcManager = new StubRTCManager();

    handler = new CreateGameHandler(gameService, gameRepository, rtcManager);

    session = new StubSessionStore();
    player = session.player = new Player('player');
  });

  const execute = () => {
    return handler.execute({}, session);
  };

  it('creates a game', async () => {
    await execute();

    const games = await gameRepository.findAll();

    expect(games).to.have.length(1);
    expect(publisher.events).deep.include({ type: 'GameCreated', game: games[0] });
  });

  it('adds the player to the created game', async () => {
    await execute();

    const game = await gameRepository.findGameForPlayer(player.id);

    expect(game).not.to.be.undefined;
    expect(player.gameId).to.eql(game!.id);
    expect(publisher.events).deep.include({ type: 'GameJoined', game, player });
    expect(rtcManager.has(game!, player)).to.be.true;
  });

  it('disallow a player to create a game when he is already in a game', async () => {
    const otherGame = new Game();

    otherGame.addPlayer(player);

    await gameRepository.save(otherGame);

    const error = await expect(execute()).to.be.rejectedWith(PlayerIsAlreadyInGameError);
    expect(error).to.shallowDeepEqual({ player });
  });
});
