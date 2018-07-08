import { expect } from 'chai';
import crio from 'crio';

import reducer from '../../src/redux/reducers/games';

const testWS = (message, state, expected) => {
  const action = {
    type: 'WS_MESSAGE',
    message,
  };

  return expect(reducer(crio(state), action)).to.deep.equal(crio(expected));
}

describe('games reducers', () => {

  it('should process a WS_GAME_PLAYER_JOINED action', () => testWS(
    {
      type: 'GAME_PLAYER_JOINED',
      gameId: 42,
      player: { nick: 'toto' },
    },
    [{ id: 42, players: [] }],
    [{ id: 42, players: [{ nick: 'toto' }] }],
  ));

});
