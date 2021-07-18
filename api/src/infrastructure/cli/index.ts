import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { log } from '../../utils/log';
import { entities } from '../database/entities';
import { SQLGameRepository } from '../database/repositories/game/SQLGameRepository';
import { SQLPlayerRepository } from '../database/repositories/player/SQLPlayerRepository';

const main = async () => {
  const connection = await createConnection({
    type: 'sqlite',
    database: './db.sqlite',
    entities,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  });

  const playerRepository = new SQLPlayerRepository(connection);
  const gameRepository = new SQLGameRepository(connection);

  const players = await playerRepository.findAll();
  const games = await gameRepository.findAll();

  console.log('players:');
  log(players);

  console.log('\n\n');

  console.log('games:');
  log(games);
};

main().catch(console.error);
