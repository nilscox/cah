import { expect } from 'chai';
import { Connection, createConnection } from 'typeorm';

import { PlayerRepository } from '../../../../domain/interfaces/PlayerRepository';
import { Player } from '../../../../domain/models/Player';
import { entities } from '../../entities';

import { InMemoryPlayerRepository } from './InMemoryPlayerRepository';
import { SQLPlayerRepository } from './SQLPlayerRepository';

const specs = (getRepository: () => PlayerRepository) => {
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
};

describe('InMemoryPlayerRepository', () => {
  specs(() => new InMemoryPlayerRepository());
});

describe('SQLPlayerRepository', () => {
  let connection: Connection;

  before(async () => {
    connection = await createConnection({
      type: 'sqlite',
      database: ':memory:',
      entities,
      synchronize: true,
    });
  });

  after(async () => {
    await connection?.close();
  });

  afterEach(async () => {
    await connection.query('delete from player');
  });

  specs(() => new SQLPlayerRepository(connection));
});
