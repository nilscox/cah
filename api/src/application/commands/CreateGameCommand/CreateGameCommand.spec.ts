import { expect } from 'earljs';

import { PlayerIsAlreadyInGameError } from '../../../domain/errors/PlayerIsAlreadyInGameError';
import { createGame, Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubConfigService } from '../../../infrastructure/stubs/StubConfigService';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { StubRTCManager } from '../../../infrastructure/stubs/StubRTCManager';
import { StubSessionStore } from '../../../infrastructure/stubs/StubSessionStore';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { expectError } from '../../../utils/expectError';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { CreateGameHandler } from './CreateGameCommand';

describe('CreateGameCommand', () => {
  let config: StubConfigService;
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let publisher: StubEventPublisher;
  let rtcManager: StubRTCManager;

  let handler: CreateGameHandler;

  let player: Player;

  const session = new StubSessionStore();

  beforeEach(async () => {
    const deps = instanciateStubDependencies();
    ({ configService: config, gameRepository, playerRepository, publisher, rtcManager } = deps);

    handler = instanciateHandler(CreateGameHandler, deps);

    player = session.player = new Player('player');
    await playerRepository.save(player);
  });

  const execute = () => {
    return handler.execute({}, session);
  };

  it('creates a game', async () => {
    config.set('GAME_CODE', 'CAFE');

    const game = await execute();

    expect(game.id).toBeA(String);
    expect(game.code).toEqual('CAFE');

    const games = await gameRepository.findAll();

    expect(games).toBeAnArrayOfLength(1);
    expect(publisher.firstEvent).toBeAnObjectWith({ type: 'GameCreated', game: games[0] });
  });

  it('generates a 4 letters code', async () => {
    config.set('GAME_CODE', '');

    const game = await execute();

    expect(game.code).toBeA(String);
    expect(game.code).toEqual(expect.stringMatching(/[A-Z0-9]{4}/));
  });

  it('adds the player to the created game', async () => {
    await execute();

    const game = (await gameRepository.findGameForPlayer(player.id)) as Game;

    expect(game as unknown).not.toEqual(undefined);
    expect(player.gameId).toEqual(game.id);

    expect(rtcManager.has(game!, player)).toEqual(true);
    expect(publisher.lastEvent).toBeAnObjectWith({ type: 'GameJoined', game, player });
  });

  it('disallows a player to create a game when he is already in a game', async () => {
    const otherGame = createGame();

    otherGame.addPlayer(player);

    await gameRepository.save(otherGame);

    const error = await expectError(execute(), PlayerIsAlreadyInGameError);
    expect(error).toBeAnObjectWith({ player });
  });
});
