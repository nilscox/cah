// @flow

export type Question = {
  id: number,
  nb_choices: number,
  split: Array<string | null>,
  text: string,
  type: string,
};
