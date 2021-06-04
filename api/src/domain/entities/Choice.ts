export class Choice {
  text!: string;

  is(other?: Choice) {
    return this === other;
  }
}
