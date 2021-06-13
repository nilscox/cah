import { expect } from 'chai';
import request from 'supertest';
import Container from 'typedi';

import { GameState, PlayState } from '../../../domain/entities/Game';
import { ChoiceRepositoryToken } from '../../../domain/interfaces/ChoiceRepository';
import { createGame, createPlayer, createStartedGame } from '../../../domain/tests/creators';
import { InMemoryChoiceRepository } from '../../../domain/tests/repositories/InMemoryChoiceRepository';
import { auth, mockCreateGame, mockQueryGame, mockQueryPlayer } from '../../test';
import { app } from '../index';

describe('/api/game', () => {
  const player = createPlayer({ id: 1, nick: 'toto' });
  const asPlayer = auth(player);

  const game = createGame({ id: 1 });

  beforeEach(() => {
    Container.reset();
    Container.set(ChoiceRepositoryToken, new InMemoryChoiceRepository());

    mockQueryPlayer(async () => player);
    mockQueryGame(async () => game);
  });

  describe('GET /api/game/:gameId', () => {
    it('fetches an idle game', async () => {
      mockQueryGame(async () => game);

      const { body } = await request(app).get(`/api/game/${game.id}`).expect(200);

      expect(body).to.eql({
        id: game.id,
        code: game.code,
        players: [],
        state: GameState.idle,
      });
    });

    it('fetches a started game', async () => {
      const game = createStartedGame({ playState: PlayState.playersAnswer });
      mockQueryGame(async () => game);

      const { body } = await request(app).get(`/api/game/${game.id}`).expect(200);

      expect(body).to.eql({
        id: game.id,
        code: game.code,
        players: game.players.map(({ nick }) => ({ nick })),
        state: GameState.started,
        playState: PlayState.playersAnswer,
        questionMaster: {
          nick: game.questionMaster?.nick,
        },
        question: {
          text: game.question?.text,
          neededChoices: game.question?.neededChoices,
        },
      });
    });
  });

  describe('POST /api/game', () => {
    it('creates a new game', async () => {
      mockCreateGame(async () => game);

      const { body } = await asPlayer.post('/api/game').send().expect(201);

      expect(body).to.eql({
        id: game.id,
        code: game.code,
        players: [],
        state: GameState.idle,
      });
    });

    it('does not create a game when unauthenticated', async () => {
      mockQueryPlayer(async () => undefined);
      await request(app).post('/api/game').send().expect(401);
    });
  });
});
