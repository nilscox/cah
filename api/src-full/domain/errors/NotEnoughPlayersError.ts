export class NotEnoughPlayersError extends Error {
  constructor(currentPlayersCount: number, minPlayers: number) {
    super(`the game has ${currentPlayersCount} players, and must have at least ${minPlayers} players to be started`);
    Object.setPrototypeOf(this, NotEnoughPlayersError.prototype);
  }
}
