import { CahClient, Fetcher } from '@cah/client';
import * as cah from '@cah/store';
import { type AppStore, createStore as createReduxStore } from '@cah/store';

declare global {
  var __ENV__: ImportMetaEnv;
}

function env<K extends keyof ImportMetaEnv>(key: K) {
  return globalThis.__ENV__[key] || import.meta.env[key];
}

const apiUrl = env('VITE_API_URL') || '/api';

const fetch = window.fetch.bind(window);
const fetcher = new Fetcher(apiUrl, fetch);
const client = new CahClient(fetcher);

const config = {
  websocketPath: `${apiUrl}/socket.io`,
};

export const store: ReturnType<typeof createReduxStore> = createReduxStore({ client, config });

declare global {
  var store: AppStore;
}

globalThis.store = store;
Object.assign(globalThis, cah);
