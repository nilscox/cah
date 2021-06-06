import { expect } from 'chai';
import sinon from 'sinon';
import { io, Socket } from 'socket.io-client';

import { GameState } from '../../domain/entities/Game';
import { createGame, createPlayer } from '../../domain/tests/creators';
import { app } from '../index';
import { auth, mockCreateGame, mockJoinGame, mockQueryPlayer } from '../test';

describe('websocket', () => {
  const port = 1234;

  before((done) => {
    app.listen(port, done);
  });

  after((done) => {
    app.close(done);
  });

  describe('unauthenticated', () => {
    it.skip('closes the socket connection when not authenticated', async () => {
      const socket = io(`ws://localhost:${port}`);

      const connectPromise = new Promise<void>((resolve) => socket.on('connect', resolve));
      const disconnectPromise = new Promise<string>((resolve) => socket.on('disconnect', resolve));

      await connectPromise;
      const reason = await disconnectPromise;

      expect(reason).to.eql('io server disconnect');
    });
  });

  describe('authenticated', () => {
    const player = createPlayer({ id: 1 });
    const asPlayer = auth(player, port);
    let socket: Socket;

    beforeEach(() => {
      socket = asPlayer.socket!;
    });

    it('connects to the websocket server', () => {
      expect(socket.connected).to.be.true;
    });

    const emit = (message: string, payload: unknown) => {
      return new Promise((resolve) => {
        socket.emit(message, payload, resolve);
      });
    };

    const errorMessage = 'Something wrong happened';
    const throwError = sinon.fake.throws(new Error(errorMessage));

    describe('createGame', () => {
      it('creates a game', async () => {
        const game = createGame();

        const createGameUseCase = sinon.fake.returns(game);
        mockCreateGame(createGameUseCase);

        expect(await emit('createGame', undefined)).to.eql({
          status: 'ok',
          game: { code: game.code, players: [], state: GameState.idle },
        });

        expect(createGameUseCase.callCount).to.eql(1);
      });

      it('returns an error when the player was not found', async () => {
        mockQueryPlayer(async () => undefined);
        expect(await emit('createGame', undefined)).to.eql({ status: 'ko', error: 'player not found' });
      });

      it('returns an error when something wrong happens', async () => {
        mockCreateGame(throwError);
        expect(await emit('createGame', undefined)).to.eql({ status: 'ko', error: errorMessage });
      });
    });

    describe('joinGame', () => {
      it('joins a game', async () => {
        const joinGame = sinon.fake();
        mockJoinGame(joinGame);

        expect(await emit('joinGame', { code: 'ABCD' })).to.eql({ status: 'ok' });

        expect(joinGame.callCount).to.eql(1);
        expect(joinGame.firstCall.calledWith('ABCD', player));
      });

      it('returns an error when the code is invalid or missing from the request', async () => {
        expect(await emit('joinGame', { code: 'hello' })).to.eql({
          status: 'ko',
          error: 'validation errors',
          validationErrors: { code: ['isLength'] },
        });

        expect(await emit('joinGame', {})).to.eql({
          status: 'ko',
          error: 'validation errors',
          validationErrors: { code: ['isLength', 'isString'] },
        });
      });

      it('returns an error when something wrong happens', async () => {
        mockJoinGame(throwError);
        expect(await emit('joinGame', { code: 'ABCD' })).to.eql({ status: 'ko', error: errorMessage });
      });
    });
  });
});
