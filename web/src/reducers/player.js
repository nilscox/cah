export default function(state = null, action) {
  switch (action.type) {
    case 'PLAYER_FETCH_SUCCESS':
      if (action.status === 404)
        return null;

      return action.body;

    case 'PLAYER_LOGIN_SUCCESS':
      return action.body;

    case 'PLAYER_LOGOUT_SUCCESS':
      return null;

    case 'GAME_SUBMIT_ANSWER_SUCCESS':
      const submitted = action.body;
      const cardsIdx = submitted.answers.map(choice => choice.id);
      const cards = state.cards.filter(card => cardsIdx.indexOf(card.id) < 0);

      return { ...state, cards, submitted };

    case 'WS_CARDS_DEALT':
      const message = action.message;

      return { ...state, cards: [ ...(state.cards || []), ...message.cards ] };

    case 'WS_NEXT_TURN':
      return { ...state, submitted: null };

    default:
      return state;
  }
}
