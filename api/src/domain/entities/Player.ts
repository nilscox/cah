import { Choice } from './Choice';
import { Game } from './Game';

export class Player {
  public id?: number;

  public nick!: string;
  public cards!: Choice[];

  public game?: Game;

  is(other?: Player) {
    return this === other;
  }
}
