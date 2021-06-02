import { Choice } from './Choice';

export class Player {
  public nick!: string;
  public cards!: Choice[];

  is(other?: Player) {
    return this === other;
  }
}
