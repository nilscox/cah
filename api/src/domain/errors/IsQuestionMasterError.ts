import { Player } from '../entities/Player';

export class IsQuestionMasterError extends Error {
  constructor(player: Player) {
    super(`player '${player.nick}' must not be the question master`);
    Object.setPrototypeOf(this, IsQuestionMasterError.prototype);
  }
}
