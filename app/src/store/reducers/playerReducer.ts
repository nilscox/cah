import { Choice } from '../../domain/entities/Choice';
import { isStarted } from '../../domain/entities/Game';
import { AppAction, Nullable } from '../types';

import { append, filter, findById, isNull, mapIds, replace } from './helpers';

export type PlayerState = Nullable<{
  id: string;
  nick: string;
  gameId?: string;
  isConnected: boolean;
  cards: Choice[];
  selection: Array<Choice | null>;
  selectionValidated: boolean;
}>;

export const playerReducer = (state: PlayerState = null, action: AppAction): PlayerState => {
  if (action.type === 'player/set') {
    return {
      ...action.payload,
      selection: [],
      selectionValidated: false,
    };
  }

  if (state === null) {
    return state;
  }

  if (action.type === 'player/set-connected') {
    return {
      ...state,
      isConnected: true,
    };
  }

  if (action.type === 'rtc/message' && action.payload.type === 'CardsDealt') {
    return {
      ...state,
      cards: append(state.cards, ...action.payload.cards),
    };
  }

  if (action.type === 'game/set') {
    const game = action.payload;

    if (game === null) {
      return null;
    }

    if (!isStarted(game)) {
      return state;
    }

    return {
      ...state,
      selection: Array(game.question.numberOfBlanks).fill(null),
    };
  }

  if (action.type === 'rtc/message' && action.payload.type === 'TurnStarted') {
    return {
      ...state,
      selection: Array(action.payload.question.numberOfBlanks).fill(null),
    };
  }

  if (action.type === 'player/set-cards') {
    return {
      ...state,
      cards: action.payload,
    };
  }

  if (action.type === 'choice/selected') {
    return {
      ...state,
      selection: replace(state.selection, isNull, action.payload),
    };
  }

  if (action.type === 'choice/unselected') {
    return {
      ...state,
      selection: replace(state.selection, findById(action.payload.id), null),
    };
  }

  if (action.type === 'player/selection-validated') {
    const selectionIds = mapIds(state.selection.filter(Boolean) as Choice[]);

    return {
      ...state,
      selectionValidated: true,
      cards: filter(state.cards, ({ id }) => !selectionIds.includes(id)),
    };
  }

  if (action.type === 'rtc/message' && action.payload.type === 'TurnFinished') {
    return {
      ...state,
      selectionValidated: false,
    };
  }

  return state;
};
