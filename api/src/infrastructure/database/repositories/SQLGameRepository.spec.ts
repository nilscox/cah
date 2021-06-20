import { expect } from 'chai';
import { getRepository } from 'typeorm';

import { GameEntity } from '../entities/GameEntity';
import { PlayerEntity } from '../entities/PlayerEntity';
import { createTestDatabase } from '../test-utils';

import { SQLGameRepository } from './SQLGameRepository';

describe('SQLGameRepository', () => {
  createTestDatabase();

  it('finds a game including its players from its id', async () => {
    const playerRepo = getRepository(PlayerEntity);
    const gameRepo = getRepository(GameEntity);

    const repo = new SQLGameRepository();

    const player = await playerRepo.save({ nick: 'player' });
    const { id: gameId } = await gameRepo.save({ code: 'COCA', players: [player] });

    const game = await repo.findOne(gameId);

    expect(game).not.to.be.undefined;
    expect(game?.players).to.have.length(1);
  });
});
