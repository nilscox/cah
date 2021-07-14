import { SessionStore } from '../../application/interfaces/SessionStore';
import { Player } from '../../domain/models/Player';

export class StubSessionStore implements SessionStore {
  public player?: Player;
}
