import { ICahClient } from '@cah/client';

export type Dependencies = {
  client: ICahClient;
  config: { apiUrl?: string; websocketPath?: string };
};
