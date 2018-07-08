import { expect } from 'chai';
import crio from 'crio';

import reducer from '../../src/redux/reducers/games';

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

  it('should process a WS_GAME_PLAYER_LEFT action', () => testWS(
    {
      type: 'GAME_PLAYER_LEFT',
      gameId: 42,
      nick: 'toto',
    },
    [{ id: 42, players: [{ nick: 'toto' }] }],
    [{ id: 42, players: [] }],
  ));

  it('should process a WS_GAME_CREATED action', () => testWS(
    {
      type: 'GAME_CREATED',
      game: { id: 69, players: [] },
    },
    [{ id: 42, players: [] }],
    [{ id: 42, players: [] }, { id: 69, players: [] }],
  ));

  it('should process a WS_GAME_STARTED action', () => testWS(
    {
      type: 'GAME_STARTED',
      game: { id: 69, players: [{ nick: 'toto' }], state: 'started' },
    },
    [{ id: 69, players: [], state: 'idle' }],
    [{ id: 69, players: [{ nick: 'toto' }], state: 'started' }],
  ));

  it('should process a WS_GAME_NEXT_TURN action', () => testWS(
    {
      type: 'GAME_NEXT_TURN',
      game: { id: 69, players: [{ nick: 'toto' }], 'play_state': 'players_answer' },
    },
    [{ id: 69, players: [{ nick: 'toto' }], 'play_state': 'end_of_turn' }],
    [{ id: 69, players: [{ nick: 'toto' }], 'play_state': 'players_answer' }],
  ));

  it('should process a WS_GAME_ANSWER_SUBMITTED action', () => testWS(
    {
      type: 'GAME_ANSWER_SUBMITTED',
      gameId: 69,
      answer: { id: 99 },
    },
    [{ id: 69, players: [{ nick: 'toto' }], propositions: [{ id: 101 }] }],
    [{ id: 69, players: [{ nick: 'toto' }], propositions: [{ id: 101 }, { id: 99 }] }],
  ));

});
