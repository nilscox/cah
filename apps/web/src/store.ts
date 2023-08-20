import { CahClient, Fetcher } from '@cah/client';
import { AppStore, createStore as createReduxStore } from '@cah/store';
import * as cah from '@cah/store';

const fetch = window.fetch.bind(window);
const fetcher = new Fetcher('/api', fetch);
const client = new CahClient(fetcher);

const config = {
  websocketPath: '/api/socket.io',
};

export const store = createReduxStore({ client, config });

declare global {
  // eslint-disable-next-line no-var
  var store: AppStore;
}

globalThis.store = store;
Object.assign(globalThis, cah);
