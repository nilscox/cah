import { Choice } from '../../domain/entities/Choice';
import { isStarted } from '../../domain/entities/Game';
import { AppAction, Nullable } from '../types';

import { append, findById, isNull, replace } from './helpers';

export type PlayerState = Nullable<{
  id: string;
  nick: string;
  gameId?: string;
  isConnected: boolean;
  cards: Choice[];
  selection: Array<Choice | null>;
}>;

export const playerReducer = (state: PlayerState = null, action: AppAction): PlayerState => {
  if (action.type === 'player/set') {
    return {
      ...action.payload,
      selection: [],
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
    if (!isStarted(action.payload)) {
      return state;
    }

    return {
      ...state,
      selection: Array(action.payload.question.numberOfBlanks).fill(null),
    };
  }

  if (action.type === 'rtc/message' && action.payload.type === 'TurnStarted') {
    return {
      ...state,
      selection: Array(action.payload.question.numberOfBlanks).fill(null),
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

  return state;
};
