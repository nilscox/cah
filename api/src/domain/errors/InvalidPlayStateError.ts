import { PlayState, StartedGame } from '../entities/Game';

export class InvalidPlayStateError extends Error {
  constructor(public readonly game: StartedGame, public readonly expected: PlayState) {
    super(`invalid play state, current play state is ${game.playState}, expected ${expected}`);
    Object.setPrototypeOf(this, InvalidPlayStateError.prototype);
  }
}
