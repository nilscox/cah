import { expect } from 'chai';
import request from 'supertest';

import { Game } from '../../domain/entities/Game';
import { Player } from '../../domain/entities/Player';
import { createGame, createPlayer } from '../../domain/tests/creators';

import { app } from './index';
import { auth, mockCreateGame, mockQueryGame, mockQueryPlayer } from './test';

describe('/api/game', () => {
  const player: Player & { id?: number } = createPlayer({ nick: 'toto' });
  player.id = 1;

  const game: Game & { id?: number } = createGame();
  game.id = 1;

  const asPlayer = auth(player);

  beforeEach(() => {
    mockQueryPlayer(() => Promise.resolve(player));
    mockQueryGame(() => Promise.resolve(game));
  });

  describe('POST /api/game', () => {
    it('creates a new game', async () => {
      mockCreateGame(() => Promise.resolve(game));

      const { body } = await asPlayer.post('/api/game').send().expect(201);

      expect(body).to.eql(game);
    });

    it('does not create a game when unauthenticated', async () => {
      mockQueryPlayer(() => Promise.resolve(undefined));
      await request(app).post('/api/game').send().expect(401);
    });
  });
});
