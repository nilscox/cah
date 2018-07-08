import { expect } from 'chai';
import crio from 'crio';

import reducer from '../../src/redux/reducers/players';

const testWS = (message, state, expected) => {
  const action = {
    type: 'WS_MESSAGE',
    message,
  };

  return expect(
    reducer(crio(state), action).thaw()
  )
  .to.deep.equal(
    crio(expected).thaw()
  );
}

describe('players reducers', () => {

  it('should process a WS_PLAYER_CONNECTED action', () => testWS(
    {
      type: 'PLAYER_CONNECTED',
      nick: 'toto',
    },
    [{ nick: 'toto', connected: false }],
    [{ nick: 'toto', connected: true }],
  ));

  it('should process a WS_PLAYER_DISCONNECTED action', () => testWS(
    {
      type: 'PLAYER_DISCONNECTED',
      nick: 'toto',
    },
    [{ nick: 'toto', connected: true }],
    [{ nick: 'toto', connected: false }],
  ));

  it('should process a WS_PLAYER_AVATAR_CHANGED action', () => testWS(
    {
      type: 'PLAYER_AVATAR_CHANGED',
      nick: 'toto',
      avatar: 'some/path',
    },
    [{ nick: 'toto', avatar: null }],
    [{ nick: 'toto', avatar: 'some/path' }],
  ));

  it('should process a WS_CARDS_DEALT action', () => testWS(
    {
      type: 'CARDS_DEALT',
      nick: 'toto',
      cards: [{ text: 'foo' }, { text: 'bar' }]
    },
    [{ nick: 'toto', cards: [{ text: 'qux' }] }],
    [{ nick: 'toto', cards: [{ text: 'qux' }, { text: 'foo' }, { text: 'bar' }] }],
  ));

});
