import { DomainError } from './DomainError';

export class NotEnoughPlayersError extends DomainError {
  constructor(readonly minimumNumberOfPlayers: number, readonly actualNumberOfPlayers: number) {
    super(`Not enough players to start the game: ${minimumNumberOfPlayers} players are required`, {
      minimumNumberOfPlayers,
      actualNumberOfPlayers,
    });
  }
}
