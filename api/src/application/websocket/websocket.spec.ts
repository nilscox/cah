import { expect } from 'chai';
import sinon from 'sinon';
import { io, Socket } from 'socket.io-client';

import { GameState } from '../../domain/entities/Game';
import { Turn } from '../../domain/entities/Turn';
import { GameEvent, PlayerEvent } from '../../domain/interfaces/GameEvents';
import { createAnswer, createChoice, createGame, createPlayer, createQuestion } from '../../domain/tests/creators';
import { app, wsGameEvents } from '../index';
import {
  auth,
  mockCreateGame,
  mockGiveChoicesSelection,
  mockJoinGame,
  mockNextTurn,
  mockPickWinningAnswer,
  mockQueryPlayer,
  mockStartGame,
} from '../test';

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

      wsGameEvents.onPlayerEvent(player, event);
      await new Promise((r) => setTimeout(r, 10));

      expect(listener.callCount).to.eql(1);
      expect(listener.firstCall.args[0]).to.eql(event);
    });

    it('handles an event to all players in a game', async () => {
      const game = createGame();

      wsGameEvents.join(game, player);

      const listener = sinon.fake();
      socket.on('message', listener);

      const event: GameEvent = { type: 'GameStarted' as const };

      wsGameEvents.onGameEvent(game, event);

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
      wsGameEvents.join(game, player);

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

    it('handles a PlayerJoined event', async () => {
      const newPlayer = createPlayer({ nick: 'toto' });

      wsGameEvents.onGameEvent(game, { type: 'PlayerJoined', player: newPlayer });
      await expectEvent({ type: 'PlayerJoined', player: { nick: newPlayer.nick } });
    });

    it('handles a GameStarted event', async () => {
      wsGameEvents.onGameEvent(game, { type: 'GameStarted' });
      await expectEvent({ type: 'GameStarted' });
    });

    it('handles a TurnStarted event', async () => {
      const question = createQuestion({ text: 'How are you?' });

      wsGameEvents.onGameEvent(game, { type: 'TurnStarted', question: question, questionMaster: player });
      await expectEvent({
        type: 'TurnStarted',
        question: { text: question.text, neededChoices: question.neededChoices },
        questionMaster: player.nick,
      });
    });

    it('handles a PlayerAnswered event', async () => {
      wsGameEvents.onGameEvent(game, { type: 'PlayerAnswered', player });
      await expectEvent({ type: 'PlayerAnswered', player: player.nick });
    });

    it('handles a AllPlayersAnswered event', async () => {
      const choice = createChoice();
      const answer = createAnswer({ player, choices: [choice] });

      wsGameEvents.onGameEvent(game, { type: 'AllPlayersAnswered', answers: [answer] });
      await expectEvent({ type: 'AllPlayersAnswered', answers: [{ id: answer.id, choices: [{ text: choice.text }] }] });
    });

    it('handles a WinnerSelected event', async () => {
      const choice = createChoice();
      const answer = createAnswer({ player, choices: [choice] });

      wsGameEvents.onGameEvent(game, { type: 'WinnerSelected', answers: [answer], winner: player });
      await expectEvent({
        type: 'WinnerSelected',
        answers: [{ id: answer.id, choices: [{ text: choice.text }], player: player.nick }],
        winner: player.nick,
      });
    });

    it('handles a TurnEnded event', async () => {
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

      wsGameEvents.onGameEvent(game, { type: 'TurnEnded', turn });
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

    it('handles a GameFinished event', async () => {
      wsGameEvents.onGameEvent(game, { type: 'GameFinished' });
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

    const emit = (message: string, payload?: unknown) => {
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

        expect(await emit('createGame')).to.eql({
          status: 'ok',
          game: { id: game.id, code: game.code, players: [], state: GameState.idle },
        });

        expect(createGameUseCase.callCount).to.eql(1);
      });

      it('returns an error when the player was not found', async () => {
        mockQueryPlayer(async () => undefined);
        expect(await emit('createGame')).to.shallowDeepEqual({ status: 'ko', error: 'player not found' });
      });

      it('returns an error when something wrong happens', async () => {
        mockCreateGame(throwError);
        expect(await emit('createGame')).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });

    describe('joinGame', () => {
      it('joins a game', async () => {
        const spyJoin = sinon.spy(wsGameEvents, 'join');

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

      it('returns an error when the code is missing from the request', async () => {
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

    describe('startGame', () => {
      const game = createGame();

      beforeEach(() => {
        player.game = game;
      });

      it('starts the game', async () => {
        const startGame = sinon.fake();
        mockStartGame(startGame);

        expect(await emit('startGame')).to.eql({ status: 'ok' });

        expect(startGame.callCount).to.eql(1);
      });

      it('returns an error when the player is not in game', async () => {
        player.game = undefined;
        expect(await emit('startGame')).to.shallowDeepEqual({ status: 'ko', error: 'player is not in game' });
      });

      it('returns an error when something wrong happens', async () => {
        mockStartGame(throwError);
        expect(await emit('startGame')).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });

    describe('giveChoicesSelection', () => {
      const game = createGame();
      const payload = { choicesIds: [1, 2] };

      beforeEach(() => {
        player.game = game;
      });

      it('sends a choices selection', async () => {
        const giveChoicesSelection = sinon.fake();
        mockGiveChoicesSelection(giveChoicesSelection);

        expect(await emit('giveChoicesSelection', payload)).to.eql({ status: 'ok' });

        expect(giveChoicesSelection.callCount).to.eql(1);
      });

      it('returns an error when the choices ids are not provided', async () => {
        expect(await emit('giveChoicesSelection', {})).to.shallowDeepEqual({
          status: 'ko',
          error: 'validation errors',
        });
      });

      it('returns an error when the player is not in game', async () => {
        player.game = undefined;
        expect(await emit('giveChoicesSelection', payload)).to.shallowDeepEqual({
          status: 'ko',
          error: 'player is not in game',
        });
      });

      it('returns an error when something wrong happens', async () => {
        mockGiveChoicesSelection(throwError);
        expect(await emit('giveChoicesSelection', payload)).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });

    describe('pickWinningAnswer', () => {
      const game = createGame();
      const payload = { answerId: 1 };

      beforeEach(() => {
        player.game = game;
      });

      it('sends the winning answer id', async () => {
        const pickWinningAnswer = sinon.fake();
        mockPickWinningAnswer(pickWinningAnswer);

        expect(await emit('pickWinningAnswer', payload)).to.eql({ status: 'ok' });

        expect(pickWinningAnswer.callCount).to.eql(1);
      });

      it('returns an error when the choices ids are not provided', async () => {
        expect(await emit('pickWinningAnswer', {})).to.shallowDeepEqual({
          status: 'ko',
          error: 'validation errors',
        });
      });

      it('returns an error when the player is not in game', async () => {
        player.game = undefined;
        expect(await emit('pickWinningAnswer', payload)).to.shallowDeepEqual({
          status: 'ko',
          error: 'player is not in game',
        });
      });

      it('returns an error when something wrong happens', async () => {
        mockPickWinningAnswer(throwError);
        expect(await emit('pickWinningAnswer', payload)).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });

    describe('nextTurn', () => {
      const game = createGame();

      beforeEach(() => {
        player.game = game;
      });

      it('ends the current', async () => {
        const nextTurn = sinon.fake();
        mockNextTurn(nextTurn);

        expect(await emit('nextTurn')).to.eql({ status: 'ok' });

        expect(nextTurn.callCount).to.eql(1);
      });

      it('returns an error when the player is not in game', async () => {
        player.game = undefined;
        expect(await emit('nextTurn')).to.shallowDeepEqual({ status: 'ko', error: 'player is not in game' });
      });

      it('returns an error when something wrong happens', async () => {
        mockNextTurn(throwError);
        expect(await emit('nextTurn')).to.shallowDeepEqual({ status: 'ko', error: errorMessage });
      });
    });
  });
});
