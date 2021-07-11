import { Entity } from '../../ddd/Entity';

import { Choice } from './Choice';
import { Player } from './Player';
import { Question } from './Question';

export class Answer extends Entity {
  constructor(public player: Player, public question: Question, public choices: Choice[]) {
    super();
  }
}
