import { LIFECYCLE } from 'redux-pack';

import { packAction, wsAction, test } from './reducers.test.utils';
import reducer from '../games';

describe('games reducer', () => {

  describe('pack', () => {

    it('should process a GAMES_LIST start action', () => test(
      reducer,
      [],
      packAction(LIFECYCLE.START, { type: 'GAMES_LIST' }),
      () => [],
    ));

    it('should process a GAMES_LIST success action', () => test(
      reducer,
      [],
      packAction(LIFECYCLE.SUCCESS, {
        type: 'GAMES_LIST',
        payload: [ 'game' ],
      }),
      () => [ 'game' ],
    ));

    it('should process a GAMES_LIST failure action', () => test(
      reducer,
      [],
      packAction(LIFECYCLE.FAILURE, {
        type: 'GAMES_LIST',
        payload: 'error',
      }),
      () => [],
    ));

  });

  describe('websocket', () => {

    it('should process a WS_GAME_PLAYER_JOINED event', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'GAMES_LIST',
          payload: [ { id: 42, players: [] } ],
        }),
      ],
      wsAction({
        type: 'GAME_PLAYER_JOINED',
        gameId: 42,
        player: { nick: 'toto' },
      }),
      () => [{ id: 42, players: [{ nick: 'toto' }] }],
    ));

    it('should process a WS_GAME_PLAYER_LEFT event', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'GAMES_LIST',
          payload: [{ id: 42, players: [{nick: 'toto' }, { nick: 'tata' }] }],
        }),
      ],
      wsAction({
        type: 'GAME_PLAYER_LEFT',
        gameId: 42,
        nick: 'toto',
      }),
      () => [{ id: 42, players: [{ nick: 'tata' }] }],
    ));

    it('should process a WS_GAME_CREATED action', () => test(
      reducer,
      [],
      wsAction({
        type: 'GAME_CREATED',
        game: { id: 42, players: [] },
      }),
      () => [{ id: 42, players: [], turns: [] }],
    ));

    it('should process a WS_GAME_STARTED action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'GAMES_LIST',
          payload: [{ id: 69, players: [{nick: 'toto' }, { nick: 'tata' }] }],
        }),
      ],
      wsAction({
        type: 'GAME_STARTED',
        game: { id: 69, players: [{ nick: 'toto' }], state: 'started' },
      }),
      () => [{ id: 69, players: [{ nick: 'toto' }], state: 'started' }],
    ));

    it('should process a WS_GAME_NEXT_TURN action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'GAMES_LIST',
          payload: [{ id: 42, players: [{nick: 'toto' }, { nick: 'tata' }] }],
        }),
      ],
      wsAction({
        type: 'GAME_NEXT_TURN',
        game: { id: 42, players: [{ nick: 'toto' }], 'play_state': 'players_answer' },
      }),
      () => [{ id: 42, players: [{ nick: 'toto' }], 'play_state': 'players_answer' }],
    ));

    it('should process a WS_GAME_ANSWER_SUBMITTED action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'GAMES_LIST',
          payload: [{ id: 69, players: [{nick: 'toto' }], propositions: [{ id: 101 }] }],
        }),
      ],
      wsAction({
        type: 'GAME_ANSWER_SUBMITTED',
        gameId: 69,
        answer: { id: 99 },
      }),
      () => [{ id: 69, players: [{ nick: 'toto' }], propositions: [{ id: 101 }, { id: 99 }] }],
    ));

  });

});
