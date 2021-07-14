import { expect } from 'chai';

import { PlayerIsAlreadyInGameError } from '../../domain/errors/PlayerIsAlreadyInGameError';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/repositories/InMemoryGameRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubSessionStore } from '../../infrastructure/stubs/StubSessionStore';

import { CreateGameHandler } from './CreateGameCommand';

describe('CreateGameCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let publisher: StubEventPublisher;

  let handler: CreateGameHandler;

  let session: StubSessionStore;
  let player: Player;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    publisher = new StubEventPublisher();

    handler = new CreateGameHandler(gameRepository, publisher);

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
    expect(publisher.events).deep.include({ type: 'GameJoined', game, player });
  });

  it('disallow a player to create a game when he is already in a game', async () => {
    const otherGame = new Game();

    otherGame.addPlayer(player);

    await gameRepository.save(otherGame);

    const error = await expect(execute()).to.be.rejectedWith(PlayerIsAlreadyInGameError);
    expect(error).to.shallowDeepEqual({ player });
  });
});
