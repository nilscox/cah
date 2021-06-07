export class Question {
  id!: number;

  text!: string;
  blanks?: number[];

  get neededChoices() {
    return this.blanks?.length ?? 1;
  }
}
