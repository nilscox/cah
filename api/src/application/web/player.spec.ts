import { expect } from 'chai';
import request from 'supertest';

import { Player } from '../../domain/entities/Player';
import { createChoice, createGame, createPlayer } from '../../domain/tests/creators';

import { app } from './index';
import { mockAuthenticate, mockQueryPlayer } from './test';

describe('/api/player', () => {
  const player: Player & { id?: number } = createPlayer({ nick: 'toto' });
  player.id = 1;

  beforeEach(() => {
    mockAuthenticate(() => Promise.resolve({ player, created: false }));
    mockQueryPlayer(() => Promise.resolve(player));
  });

  describe('POST /api/player', () => {
    it('authenticates as a new player', async () => {
      mockAuthenticate(() => Promise.resolve({ player, created: true }));

      const { body } = await request(app).post('/api/player').send({ nick: player.nick }).expect(201);

      expect(body).to.have.property('nick', player.nick);
    });

    it('authenticates as an existing player', async () => {
      const { body } = await request(app).post('/api/player').send({ nick: player.nick }).expect(200);

      expect(body).to.have.property('nick', player.nick);
    });
  });

  describe('GET /api/player/me', () => {
    const agent = request.agent(app);

    beforeEach(async () => {
      await agent.post('/api/player').send();
    });

    it('does not retrieve anything when the player is not authenticated', async () => {
      await request(app).get('/api/player/me').expect(401);
    });

    it('retrieves the player associated to a session', async () => {
      const { body } = await agent.get('/api/player/me').expect(200);

      expect(body).to.have.property('nick', player.nick);
    });

    it('formats a player who is not in game', async () => {
      const { body } = await agent.get('/api/player/me').expect(200);

      expect(body).to.eql({
        nick: player.nick,
      });
    });

    it('formats a player who is in game', async () => {
      player.game = createGame();
      player.cards = [createChoice({ text: 'hello' })];

      mockQueryPlayer(() => Promise.resolve(player));

      const { body } = await agent.get('/api/player/me').expect(200);

      expect(body).to.eql({
        nick: player.nick,
        cards: [{ text: 'hello' }],
      });
    });
  });
});
