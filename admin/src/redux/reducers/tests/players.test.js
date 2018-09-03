/* eslint-disable */

import { LIFECYCLE } from 'redux-pack';

import { packAction, wsAction, test } from './reducers.test.utils';
import reducer from '../players';

describe('players reducer', () => {

  describe('websocket', () => {

    it('should process a WS_PLAYER_CONNECTED action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'PLAYERS_LIST',
          payload: [{ nick: 'toto', connected: false }],
        }),
      ],
      wsAction({
        type: 'PLAYER_CONNECTED',
        nick: 'toto',
      }),
      () => [{ nick: 'toto', connected: true }],
    ));

    it('should process a WS_PLAYER_DISCONNECTED action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'PLAYERS_LIST',
          payload: [{ nick: 'toto', connected: true }],
        }),
      ],
      wsAction({
        type: 'PLAYER_DISCONNECTED',
        nick: 'toto',
      }),
      () => [{ nick: 'toto', connected: false }],
    ));

    it('should process a WS_PLAYER_AVATAR_CHANGED action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'PLAYERS_LIST',
          payload: [{ nick: 'toto', avatar: null }],
        }),
      ],
      wsAction({
        type: 'PLAYER_AVATAR_CHANGED',
        nick: 'toto',
        avatar: 'some/path',
      }),
      () => [{ nick: 'toto', avatar: 'some/path' }],
    ));

    it('should process a WS_CARDS_DEALT action', () => test(
      reducer,
      [
        packAction(LIFECYCLE.SUCCESS, {
          type: 'PLAYERS_LIST',
          payload: [{ nick: 'toto', cards: [{ text: 'qux' }] }],
        }),
      ],
      wsAction({
        type: 'CARDS_DEALT',
        nick: 'toto',
        cards: [{ text: 'foo' }, { text: 'bar' }]
      }),
      () => [{ nick: 'toto', cards: [{ text: 'qux' }, { text: 'foo' }, { text: 'bar' }] }],
    ));

  });

});
