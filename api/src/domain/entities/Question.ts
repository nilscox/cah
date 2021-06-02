export class Question {
  text!: string;
  blanks?: number[];

  get neededChoices() {
    return this.blanks?.length ?? 1;
  }
}
