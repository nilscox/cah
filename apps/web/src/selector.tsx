import { AppState } from '@cah/store';
import { createMemo, createSignal, onCleanup } from 'solid-js';

import { store } from './store';

const getState = () => {
  const [state, setState] = createSignal(store.getState());

  const unsubscribe = store.subscribe(() => {
    setState(store.getState());
  });

  onCleanup(() => {
    unsubscribe();
  });

  return state;
};

export function selector<Result>(selector: (state: AppState) => Result) {
  const state = getState();
  const result = createMemo(() => selector(state()));

  return result;
}
