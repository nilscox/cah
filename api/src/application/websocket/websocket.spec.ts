import { expect } from 'chai';
import sinon from 'sinon';
import { io, Socket } from 'socket.io-client';

import { GameState } from '../../domain/entities/Game';
import { Turn } from '../../domain/entities/Turn';
import { GameEvent, PlayerEvent } from '../../domain/interfaces/GameEvents';
import { createAnswer, createChoice, createGame, createPlayer, createQuestion } from '../../domain/tests/creators';
import { app, wsServer } from '../index';
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

    it.skip('prevents from connecting twice', async () => {
      const cookie = asPlayer.jar.getCookie('connect.sid', {
        domain: 'localhost',
        path: '/',
        script: false,
        secure: false,
      });

      const socket = io(`ws://localhost:${port}`, {
        extraHeaders: {
          cookie: [cookie?.name, cookie?.value].join('='),
        },
      });

      const connectPromise = new Promise<void>((resolve) => socket.on('connect', resolve));
      const disconnectPromise = new Promise<string>((resolve) => socket.on('disconnect', resolve));

      await connectPromise;
      const reason = await disconnectPromise;

      expect(reason).to.eql('io server disconnect');
      await new Promise((r) => setTimeout(r, 100));
    });

    it('emits an event to a player', async () => {
      const listener = sinon.fake();
      socket.on('message', listener);

      const event: PlayerEvent = { type: 'CardsDealt' as const, cards: [createChoice()] };

      wsServer.emit(createGame(), player, event);
      await new Promise((r) => setTimeout(r, 10));

      expect(listener.callCount).to.eql(1);
      expect(listener.firstCall.args[0]).to.eql(event);
    });

    it('broadcasts an event to all players in a game', async () => {
      const game = createGame();

      wsServer.join(game, player);

      const listener = sinon.fake();
      socket.on('message', listener);

      const event: GameEvent = { type: 'GameStarted' as const };

      wsServer.broadcast(game, event);

      // ack are not supported
      await new Promise((r) => setTimeout(r, 10));

      expect(listener.callCount).to.eql(1);
      expect(listener.firstCall.args[0]).to.eql(event);
    });
  });

  describe('events', () => {
    const player = createPlayer({ id: 1 });
    const asPlayer = auth(player, port);
    let socket: Socket;
    let event: unknown;

    const game = createGame({ id: 1 });

    beforeEach(() => {
      socket = asPlayer.socket!;
      wsServer.join(game, player);

      event = undefined;
      socket.on('message', (e) => {
        event = e;
      });
    });

    const expectEvent = async (expected: Record<string, unknown>) => {
      while (!event) {
        await new Promise((r) => setTimeout(r, 0));
      }

      expect(event).to.eql(expected);
    };

    it('broadcasts a PlayerJoined event', async () => {
      const newPlayer = createPlayer({ nick: 'toto' });

      wsServer.broadcast(game, { type: 'PlayerJoined', player: newPlayer });
      await expectEvent({ type: 'PlayerJoined', player: { nick: newPlayer.nick } });
    });

    it('broadcasts a GameStarted event', async () => {
      wsServer.broadcast(game, { type: 'GameStarted' });
      await expectEvent({ type: 'GameStarted' });
    });

    it('broadcasts a TurnStarted event', async () => {
      const question = createQuestion({ text: 'How are you?' });

      wsServer.broadcast(game, { type: 'TurnStarted', question: question, questionMaster: player });
      await expectEvent({
        type: 'TurnStarted',
        question: { text: question.text, neededChoices: question.neededChoices },
        questionMaster: player.nick,
      });
    });

    it('broadcasts a PlayerAnswered event', async () => {
      wsServer.broadcast(game, { type: 'PlayerAnswered', player });
      await expectEvent({ type: 'PlayerAnswered', player: player.nick });
    });

    it('broadcasts a AllPlayersAnswered event', async () => {
      const choice = createChoice();
      const answer = createAnswer({ player, choices: [choice] });

      wsServer.broadcast(game, { type: 'AllPlayersAnswered', answers: [answer] });
      await expectEvent({ type: 'AllPlayersAnswered', answers: [{ id: answer.id, choices: [{ text: choice.text }] }] });
    });

    it('broadcasts a WinnerSelected event', async () => {
      const choice = createChoice();
      const answer = createAnswer({ player, choices: [choice] });

      wsServer.broadcast(game, { type: 'WinnerSelected', answers: [answer], winner: player });
      await expectEvent({
        type: 'WinnerSelected',
        answers: [{ id: answer.id, choices: [{ text: choice.text }], player: player.nick }],
        winner: player.nick,
      });
    });

    it('broadcasts a TurnEnded event', async () => {
      const question = createQuestion();
      const choice = createChoice();
      const answer = createAnswer({ player, choices: [choice] });

      const turn: Turn = {
        id: 1,
        questionMaster: player,
        answers: [answer],
        question,
        winner: player,
      };

      wsServer.broadcast(game, { type: 'TurnEnded', turn });
      await expectEvent({
        type: 'TurnEnded',
        turn: {
          questionMaster: player.nick,
          question: { text: question.text, neededChoices: question.neededChoices },
          answers: [{ id: answer.id, choices: [{ text: choice.text }], player: player.nick }],
          winner: player.nick,
        },
      });
    });

    it('broadcasts a GameFinished event', async () => {
      wsServer.broadcast(game, { type: 'GameFinished' });
      await expectEvent({ type: 'GameFinished' });
    });
  });

  describe('use cases', () => {
    const player = createPlayer({ id: 1 });
    const asPlayer = auth(player, port);
    let socket: Socket;

    beforeEach(() => {
      socket = asPlayer.socket!;
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
          game: { id: game.id, code: game.code, players: [], state: GameState.idle },
        });

        expect(createGameUseCase.callCount).to.eql(1);
      });

      it('returns an error when the player was not found', async () => {
        mockQueryPlayer(async () => undefined);
        expect(await emit('createGame', undefined)).to.shallowDeepEqual({ status: 'ko', error: 'player not found' });
      });

      it('returns an error when something wrong happens', async () => {
        mockCreateGame(throwError);
        expect(await emit('createGame', undefined)).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });

    describe('joinGame', () => {
      it('joins a game', async () => {
        const spyJoin = sinon.spy(wsServer, 'join');

        const game = createGame();
        const joinGame = sinon.fake.returns(game);
        mockJoinGame(joinGame);

        expect(await emit('joinGame', { code: 'ABCD' })).to.eql({ status: 'ok' });

        expect(joinGame.callCount).to.eql(1);
        expect(joinGame.firstCall.calledWith('ABCD', player));

        expect(spyJoin.calledOnce).to.be.true;
        expect(spyJoin.firstCall.args[0]).to.eql(game);
        expect(spyJoin.firstCall.args[1]).to.eql(player);

        spyJoin.restore();
      });

      it('returns an error when the code is invalid or missing from the request', async () => {
        expect(await emit('joinGame', { code: 'hello' })).to.shallowDeepEqual({
          status: 'ko',
          error: 'validation errors',
          validationErrors: { code: ['isLength'] },
        });

        expect(await emit('joinGame', {})).to.shallowDeepEqual({
          status: 'ko',
          error: 'validation errors',
          validationErrors: { code: ['isLength', 'isString'] },
        });
      });

      it('returns an error when something wrong happens', async () => {
        mockJoinGame(throwError);
        expect(await emit('joinGame', { code: 'ABCD' })).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });
  });
});
