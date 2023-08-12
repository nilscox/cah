import { AppSelector } from '@cah/store';
import { createSignal, onCleanup } from 'solid-js';

import { store } from './store';

export function selector<Params extends unknown[], Result>(
  selector: AppSelector<Params, Result>,
  ...params: Params
) {
  const [value, setValue] = createSignal(selector(store.getState(), ...params));
  const timeouts: number[] = [];

  const unsubscribe = store.subscribe(() => {
    const timeout = window.setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      setValue(selector(store.getState(), ...params) as Exclude<Result, Function>);
    }, 0);

    timeouts.push(timeout);
  });

  onCleanup(() => {
    unsubscribe();

    for (const timeout of timeouts) {
      window.clearTimeout(timeout);
    }
  });

  return value;
}
