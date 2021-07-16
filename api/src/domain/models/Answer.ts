import { Entity } from '../../ddd/Entity';

import { Choice } from './Choice';
import { Player } from './Player';
import { Question } from './Question';

export class Answer extends Entity {
  constructor(private _player: Player, private _question: Question, private _choices: Choice[]) {
    super();
  }

  get player() {
    return this._player;
  }

  get question() {
    return this._question;
  }

  get choices() {
    return this._choices;
  }

  hasChoice(choice: Choice): boolean {
    return this._choices.some((c) => c.equals(choice));
  }

  toJSON(anonymous = false) {
    return {
      id: this.id,
      ...(!anonymous && { player: this._player.nick }),
      choices: this._choices.map(({ text }) => text),
      formatted: this._question.toString(this._choices),
    };
  }
}
