import expect from 'expect';

import { setGame, setPlayer } from '../../domain/actions';
import { Game } from '../../domain/entities/Game';
import {
  createAnonymousAnswer,
  createAnswer,
  createFullPlayer,
  createGame,
  createPlayer,
  createPlayers,
  createQuestion,
  createStartedGame,
  createState,
  createTurns,
} from '../../tests/factories';
import { InMemoryStore } from '../../tests/InMemoryStore';

import {
  selectCanStartGame,
  selectCurrentQuestion,
  selectIsLastTurn,
  selectIsWinningAnswer,
  selectPlayers,
  selectTurns,
} from './gameSelectors';

describe('gameSelectors', () => {
  describe('selectIsLastTurn', () => {
    it('returns true when the current turn is the last turn', () => {
      const turns = createTurns(1);
      const state = createState({ game: createStartedGame({ totalQuestions: 2, turns }) });

      expect(selectIsLastTurn(state)).toEqual(true);
    });

    it('returns false when the current turn is not the last turn', () => {
      const turns = createTurns(1);
      const state = createState({ game: createStartedGame({ totalQuestions: 3, turns }) });

      expect(selectIsLastTurn(state)).toEqual(false);
    });
  });

  describe('selectCanStartGame', () => {
    const state = (overrides: Partial<Game> = {}) => {
      const { dispatch, getState } = new InMemoryStore();

      const player = createFullPlayer({ nick: 'wazabi' });

      dispatch(setPlayer(player));
      dispatch(setGame(createGame({ creator: player, players: createPlayers(3), ...overrides })));

      return getState();
    };

    it('allows to start a game', () => {
      expect(selectCanStartGame(state())).toEqual(true);
    });

    it('does not allow to start a game when the player is not the game creator', () => {
      expect(selectCanStartGame(state({ creator: createPlayer() }))).toEqual(false);
    });

    it('does not allow to start a game containing less than 3 players', () => {
      expect(selectCanStartGame(state({ players: createPlayers(2) }))).toEqual(false);
    });
  });

  describe('selectTurns', () => {
    it("selects the game's turns", () => {
      const turns = createTurns(1);
      const state = createState({
        game: createGame({ turns }),
      });

      expect(selectTurns(state)).toEqual(turns);
    });
  });

  describe('selectPlayers', () => {
    it("selects the game's players", () => {
      const players = createPlayers(1);
      const state = createState({
        game: createGame({ players }),
      });

      expect(selectPlayers(state)).toEqual(players);
    });
  });

  describe('selectCurrentQuestion', () => {
    it('selects the current question', () => {
      const question = createQuestion();
      const state = createState({
        game: createStartedGame({ question }),
      });

      expect(selectCurrentQuestion(state)).toEqual(question);
    });
  });

  describe('selectIsWinningAnswer', () => {
    it("returns true when an answer in the winner's answer", () => {
      const winner = createPlayer();
      const answer = createAnswer({ player: winner });

      const state = createState({ game: createStartedGame({ winner }) });

      expect(selectIsWinningAnswer(state)(answer)).toEqual(true);
    });

    it('returns false when the answer is annonymous', () => {
      const winner = createPlayer();
      const answer = createAnonymousAnswer();

      const state = createState({ game: createStartedGame({ winner }) });

      expect(selectIsWinningAnswer(state)(answer)).toEqual(false);
    });

    it('returns false when an answer there is no winner', () => {
      const answer = createAnswer();

      const state = createState({ game: createStartedGame() });

      expect(selectIsWinningAnswer(state)(answer)).toEqual(false);
    });

    it("returns false when an answer in not the winner's answer", () => {
      const winner = createPlayer();
      const answer = createAnswer();

      const state = createState({ game: createStartedGame({ winner }) });

      expect(selectIsWinningAnswer(state)(answer)).toEqual(false);
    });
  });
});
