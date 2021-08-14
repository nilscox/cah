import expect from 'expect';

import { setGame, setPlayer } from '../../domain/actions';
import { Game } from '../../domain/entities/Game';
import {
  createFullPlayer,
  createGame,
  createPlayer,
  createPlayers,
  createQuestion,
  createStartedGame,
  createState,
  createTurn,
  createTurns,
} from '../../tests/factories';
import { InMemoryStore } from '../../tests/InMemoryStore';

import {
  selectCanStartGame,
  selectCurrentQuestion,
  selectGameWinners,
  selectPlayers,
  selectScores,
  selectScoresExcludingWinners,
  selectTurns,
} from './gameSelectors';

describe('gameSelectors', () => {
  const nicks = ['player1', 'player2', 'player3'];

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

  describe('selectScores', () => {
    it('selects empty scores when the game has no turns', () => {
      const players = createPlayers(2, { nick: nicks });

      const state = createState({
        game: createGame({ players }),
      });

      expect(selectScores(state)).toEqual(players.map((player) => [player, 0]));
    });

    it("selects the game's scores", () => {
      const players = createPlayers(3, { nick: nicks });
      const [winner1, notWinner, winner2] = players;

      const turns = [createTurn({ winner: winner1 }), createTurn({ winner: winner2 }), createTurn({ winner: winner1 })];

      const state = createState({
        game: createGame({ players, turns }),
      });

      expect(selectScores(state)).toEqual([
        [winner1, 2],
        [winner2, 1],
        [notWinner, 0],
      ]);
    });

    it("selects the game's scores with players who have left the game", () => {
      const [playerWhoLeft, winner] = createPlayers(2, { nick: nicks });

      const turns = [createTurn({ winner: playerWhoLeft }), createTurn({ winner })];

      const state = createState({
        game: createGame({ players: [winner], turns }),
      });

      expect(selectScores(state)).toEqual([
        [winner, 1],
        [playerWhoLeft, 1],
      ]);
    });
  });

  describe('selectGameWinners', () => {
    it('selects no one when the game has no turns', () => {
      const players = createPlayers(1);

      const state = createState({
        game: createGame({ players }),
      });

      expect(selectGameWinners(state)).toEqual(null);
    });

    it("selects the game's current winner", () => {
      const players = createPlayers(2, { nick: nicks });
      const [winner] = players;

      const turns = createTurns(2, { winner });

      const state = createState({
        game: createGame({ players, turns }),
      });

      expect(selectGameWinners(state)).toEqual([[winner], 2]);
    });

    it('selects multiple tied winners', () => {
      const players = createPlayers(3, { nick: nicks });
      const turns = createTurns(2, { winner: players });

      const state = createState({
        game: createGame({ players, turns }),
      });

      expect(selectGameWinners(state)).toEqual([players.slice(0, 2), 1]);
    });
  });

  describe('selectScoresExcludingWinners', () => {
    it('selects all the players when the game has no turns', () => {
      const player = createPlayer();

      const state = createState({
        game: createGame({ players: [player] }),
      });

      expect(selectScoresExcludingWinners(state)).toEqual([]);
    });

    it("selects the scores excluding the game's winners", () => {
      const players = createPlayers(2, { nick: nicks });
      const [winner, notWinner] = players;

      const turns = [createTurn({ winner })];

      const state = createState({
        game: createGame({ players, turns }),
      });

      expect(selectScoresExcludingWinners(state)).toEqual([[notWinner, 0]]);
    });

    it("selects the scores excluding the game's tied winners", () => {
      const players = createPlayers(3, { nick: nicks });
      const [, , notWinner] = players;
      const turns = createTurns(2, { winner: players });

      const state = createState({
        game: createGame({ players, turns }),
      });

      expect(selectScoresExcludingWinners(state)).toEqual([[notWinner, 0]]);
    });
  });
});
