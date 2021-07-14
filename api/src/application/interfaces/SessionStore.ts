import { Player } from '../../domain/models/Player';

export interface SessionStore {
  player?: Player;
}
