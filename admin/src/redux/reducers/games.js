import { handle } from 'redux-pack';
import { fromJS, List } from 'immutable';

import { GAMES_LIST, GAME_FETCH_HISTORY } from '../actions';

export default (state = List(), action) => {
  const { type, payload, meta } = action;
  const findGame = (games, id) => games.findIndex(g => g.id === id);

  const handlers = {
    [GAMES_LIST]: {
      start   : () => List(),
      success : () => fromJS(payload).map(game => game.merge({ turns: List() })),
      failure : () => List(),
    },
    [GAME_FETCH_HISTORY]: {
      start   : (games) => games.setIn([findGame(games, meta.gameId), 'turns'], List()),
      success : (games) => games.setIn([findGame(games, meta.gameId), 'turns'], fromJS(payload)),
    },
  };

  return handlers[type]
    ? handle(state, action, handlers[type])
    : state;
};
