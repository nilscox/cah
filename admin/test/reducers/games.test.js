import { expect } from 'chai';
import crio from 'crio';

import reducer from '../../src/redux/reducers/games';

describe('games reducers', () => {

  it('should process a WS_GAME_PLAYER_JOINED action', () => {
    const state = crio([{ id: 42, players: [] }]);
    const action = {
      type: 'WS_MESSAGE',
      message: {
        type: 'GAME_PLAYER_JOINED',
        gameId: 42,
        player: { nick: 'toto' },
      },
    };
    const expected = [
      { id: 42, players: [{ nick: 'toto' }] },
    ];

    expect(reducer(state, action)).to.deep.equal(crio(expected));
  });

});
