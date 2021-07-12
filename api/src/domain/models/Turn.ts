import { Entity } from '../../ddd/Entity';

import { Answer } from './Answer';
import { Player } from './Player';
import { Question } from './Question';

export class Turn extends Entity {
  constructor(
    public readonly questionMaster: Player,
    public readonly question: Question,
    public readonly answers: Answer[],
    public readonly winner: Player,
  ) {
    super();
  }
}
