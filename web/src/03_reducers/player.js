export default function(state = null, action) {
  switch (action.type) {
    case 'API_DOWN':
    case 'PLAYER_FETCH_SUCCESS':
      if (action.status === 404)
        return null;

      return { ...action.body, selection: [] };

    case 'PLAYER_LOGIN_SUCCESS':
      return { ...action.body, selection: [] };

    case 'PLAYER_LOGOUT_SUCCESS':
      return null;

    case 'CHANGE_PLAYER_AVATAR_SUCCESS':
      return { ...state, ...action.body };

    case 'GAME_SUBMIT_ANSWER_SUCCESS':
      const submitted = action.body;
      const cardsIdx = submitted.answers.map(choice => choice.id);
      const cards = state.cards.filter(card => cardsIdx.indexOf(card.id) < 0);

      return { ...state, cards, submitted };

    case 'GAME_TOGGLE_CHOICE':
      const selection = Object.values(state.selection);
      const idx = selection.indexOf(action.choice);

      if (idx < 0) {
        let firstAvailableIdx = 0;

        while (state.selection[firstAvailableIdx] !== undefined)
          ++firstAvailableIdx;

        return { ...state, selection: { ...state.selection, [firstAvailableIdx]: action.choice } };
      }
      else {
        const newSelection = selection.reduce((obj, choice, idx) => {
          if (choice !== action.choice)
            obj[idx] = choice;

          return obj;
        }, {});

        return { ...state, selection: newSelection };
      }

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
