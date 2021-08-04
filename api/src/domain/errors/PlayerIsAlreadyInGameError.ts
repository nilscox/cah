import { Player } from '../models/Player';

import { DomainError } from './DomainError';

export class PlayerIsAlreadyInGameError extends DomainError {
  constructor(readonly player: Player) {
    super('Player is already in a game', { gameId: player.gameId });
  }
}
