import { Game, PlayState } from '../entities/Game';

export class InvalidPlayStateError extends Error {
  constructor(public readonly game: Game, public readonly expected: PlayState) {
    super(`invalid play state, current play state is ${game.playState}, expected ${expected}`);
    Object.setPrototypeOf(this, InvalidPlayStateError.prototype);
  }
}
