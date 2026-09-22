import { CahClient, Fetcher } from '@cah/client';
import * as cah from '@cah/store';
import { type AppStore, createStore as createReduxStore } from '@cah/store';

const fetch = window.fetch.bind(window);
const fetcher = new Fetcher('/api', fetch);
const client = new CahClient(fetcher);

const config = {
  websocketPath: '/api/socket.io',
};

export const store: ReturnType<typeof createReduxStore> = createReduxStore({ client, config });

declare global {
  var store: AppStore;
}

globalThis.store = store;
Object.assign(globalThis, cah);
