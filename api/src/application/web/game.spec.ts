import { expect } from 'chai';
import request from 'supertest';

import { createGame, createPlayer } from '../../domain/tests/creators';
import { auth, mockCreateGame, mockQueryGame, mockQueryPlayer } from '../test';

import { app } from './index';

describe('/api/game', () => {
  const player = createPlayer({ id: 1, nick: 'toto' });
  const asPlayer = auth(player);

  const game = createGame({ id: 1 });

  beforeEach(() => {
    mockQueryPlayer(async () => player);
    mockQueryGame(async () => game);
  });

  describe('POST /api/game', () => {
    it('creates a new game', async () => {
      mockCreateGame(async () => game);

      const { body } = await asPlayer.post('/api/game').send().expect(201);

      expect(body).to.eql(game);
    });

    it('does not create a game when unauthenticated', async () => {
      mockQueryPlayer(async () => undefined);
      await request(app).post('/api/game').send().expect(401);
    });
  });
});
