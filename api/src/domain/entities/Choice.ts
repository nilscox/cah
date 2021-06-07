export class Choice {
  id!: number;

  text!: string;

  is(other?: Choice) {
    return this === other;
  }
}
