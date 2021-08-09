import { expect } from 'chai';
import { Connection, getRepository as getTypeOrmRepository } from 'typeorm';

import { PlayerRepository } from '../../../../application/interfaces/PlayerRepository';
import { Choice } from '../../../../domain/models/Choice';
import { createGame, Game } from '../../../../domain/models/Game';
import { Player } from '../../../../domain/models/Player';
import { createTestDatabaseConnection } from '../../../../utils/createTestDatabaseConnection';
import { ChoiceEntity } from '../../entities/ChoiceEntity';
import { GameEntity } from '../../entities/GameEntity';
import { InMemoryCache } from '../../InMemoryCache';

import { InMemoryPlayerRepository } from './InMemoryPlayerRepository';
import { SQLPlayerRepository } from './SQLPlayerRepository';

const specs = (
  getRepository: () => PlayerRepository,
  saveGame?: (game: Game) => Promise<void>,
  saveChoice?: (choice: Choice, game: Game) => Promise<void>,
) => {
  let repository: PlayerRepository;

  beforeEach(() => {
    repository = getRepository();
  });

  it('finds all players', async () => {
    expect(await repository.findAll()).to.eql([]);

    const player = new Player('toto');
    await repository.save(player);

    const players = await repository.findAll();

    expect(players).to.have.length(1);
    expect(players[0]).to.have.property('id', player.id);
  });

  it('finds a player from its id', async () => {
    expect(await repository.findPlayerById('')).to.be.undefined;

    const player = new Player('toto');
    await repository.save(player);

    const savedPlayer = await repository.findPlayerById(player.id);

    expect(savedPlayer).to.have.property('id', player.id);
  });

  it('finds a player from its nick', async () => {
    expect(await repository.findPlayerByNick('')).to.be.undefined;

    const player = new Player('toto');
    await repository.save(player);

    expect(await repository.findPlayerById(player.id)).to.have.property('id', player.id);
  });

  it('saves the player and his cards', async () => {
    const game = createGame();
    const player = new Player('toto');
    const cards = [new Choice('choice')];

    player.gameId = game.id;

    await repository.save?.(game.creator);

    await saveGame?.(game);
    await saveChoice?.(cards[0], game);

    player.cards = cards;

    await repository.save(player);

    const savedPlayer = (await repository.findPlayerById(player.id))!;

    expect(savedPlayer?.nick).to.equal('toto');
    expect(savedPlayer?.cards).to.eql(cards);

    savedPlayer.nick = 'nick';
    savedPlayer.cards[0].available = false;
    savedPlayer.hasFlushed = true;

    await repository.save(savedPlayer);

    const resavedPlayer = await repository.findPlayerById(savedPlayer.id);

    expect(resavedPlayer?.nick).to.equal('nick');
    expect(resavedPlayer?.cards[0].available).to.be.false;
    expect(resavedPlayer?.hasFlushed).to.be.true;
  });
};

describe('InMemoryPlayerRepository', () => {
  specs(() => new InMemoryPlayerRepository(new InMemoryCache()));
});

describe('SQLPlayerRepository', () => {
  const getConnection = createTestDatabaseConnection();
  let connection: Connection;

  before(async () => {
    connection = getConnection();
  });

  const saveGame = async (game: Game) => {
    await getTypeOrmRepository(GameEntity).save(GameEntity.toPersistence(game));
  };

  const saveChoice = async (choice: Choice, game: Game) => {
    await getTypeOrmRepository(ChoiceEntity).save(ChoiceEntity.toPersistence(choice, game.id));
  };

  specs(() => new SQLPlayerRepository(connection), saveGame, saveChoice);
});
