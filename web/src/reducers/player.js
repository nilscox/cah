import { append, remove } from "./utils";

export default function(state = null, action) {
  switch (action.type) {
    case 'PLAYER_FETCH_SUCCESS':
      if (action.status === 404)
        return null;

      return { ...action.body, selection: [] };

    case 'PLAYER_LOGIN_SUCCESS':
      return { ...action.body, selection: [] };

    case 'PLAYER_LOGOUT_SUCCESS':
      return null;

    case 'GAME_SUBMIT_ANSWER_SUCCESS':
      const submitted = action.body;
      const cardsIdx = submitted.answers.map(choice => choice.id);
      const cards = state.cards.filter(card => cardsIdx.indexOf(card.id) < 0);

      return { ...state, cards, submitted };

    case 'GAME_TOGGLE_CHOICE':
      if (state.selection.indexOf(action.choice) < 0)
        return { ...state, selection: append(state.selection, action.choice) };
      else
        return { ...state, selection: remove(state.selection, action.choice) };

    case 'WEBSOCKET_MESSAGE':
      const message = action.message;

      switch (message.type) {
        case 'CARDS_DEALT':
          return { ...state, cards: [ ...(state.cards || []), ...message.cards ] };

        case 'NEXT_TURN':
          return { ...state, submitted: null, selection: [] };

        default:
          return state;
      }

    default:
      return state;
  }
}
