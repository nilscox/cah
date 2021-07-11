import { DomainError } from '../../ddd/DomainError';

export class NotEnoughPlayersError extends DomainError {
  constructor(public readonly minimumNumberOfPlayers: number, public readonly actualNumberOfPlayers: number) {
    super(`Not enough players to start the game: ${minimumNumberOfPlayers} players are required`);
  }
}
