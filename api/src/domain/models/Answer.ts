import { Entity } from '../../ddd/Entity';

import { Choice } from './Choice';
import { Player } from './Player';
import { Question } from './Question';

export class Answer extends Entity {
  constructor(readonly player: Player, readonly question: Question, readonly choices: Choice[]) {
    super();
  }

  hasChoice(choice: Choice): boolean {
    return this.choices.some((c) => c.equals(choice));
  }

  toJSON(anonymous = false) {
    return {
      id: this.id,
      ...(!anonymous && { player: this.player.nick }),
      choices: this.choices.map((choice) => choice.toJSON()),
      formatted: this.question.toString(this.choices),
    };
  }
}
