import { expect } from 'chai';
import request from 'supertest';

import { createChoice, createGame, createPlayer } from '../../domain/tests/creators';
import { auth, mockAuthenticate, mockQueryPlayer } from '../test';

import { app } from './index';

describe('/api/player', () => {
  const player = createPlayer({ id: 1, nick: 'toto' });

  beforeEach(() => {
    mockAuthenticate(async () => ({ player, created: false }));
    mockQueryPlayer(async () => player);
  });

  describe('POST /api/player', () => {
    it('authenticates as a new player', async () => {
      mockAuthenticate(async () => ({ player, created: true }));

      const { body } = await request(app).post('/api/player').send({ nick: player.nick }).expect(201);

      expect(body).to.have.property('nick', player.nick);
    });

    it('authenticates as an existing player', async () => {
      const { body } = await request(app).post('/api/player').send({ nick: player.nick }).expect(200);

      expect(body).to.have.property('nick', player.nick);
    });
  });

  describe('GET /api/player/me', () => {
    const asUser = auth(player);

    it('does not retrieve anything when the player is not authenticated', async () => {
      await request(app).get('/api/player/me').expect(401);
    });

    it('retrieves the player associated to a session', async () => {
      const { body } = await asUser.get('/api/player/me').expect(200);

      expect(body).to.have.property('nick', player.nick);
    });

    it('formats a player who is not in game', async () => {
      const { body } = await asUser.get('/api/player/me').expect(200);

      expect(body).to.eql({
        nick: player.nick,
      });
    });

    it('formats a player who is in game', async () => {
      player.game = createGame();
      player.cards = [createChoice({ text: 'hello' })];

      const { body } = await asUser.get('/api/player/me').expect(200);

      expect(body).to.eql({
        nick: player.nick,
        cards: [{ text: player.cards[0].text }],
      });
    });
  });
});
