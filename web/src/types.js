// @flow

export type QuestionType = {
  id: number,
  type: 'fill' | 'question',
  text: string,
  split: Array<string | null>,
  nb_choices: number,
};

export type ChoiceType = {
  id: number,
  text: string,
};

export type AnswerType = {
  answers: Array<ChoiceType>,
};

export type AnsweredQuestionType = {
  id: number,
  question: QuestionType,
  text: string,
  split: Array<string | null>,
  answers: Array<ChoiceType>,
  answered_by: string,
  selected_by: string | null,
};

export type PartialAnsweredQuestionType = {
  id: number,
  question: QuestionType,
  text: string,
  split: Array<string>,
  answers: Array<ChoiceType>,
};

export type LightAnsweredQuestionType = {
  id: number,
  text: string,
  split: Array<string>,
  answers: Array<ChoiceType>,
  answered_by: string,
};

export type PlayerType = {
  nick: string,
  score: number,
  avatar: string,
  connected: boolean,
};

export type FullPlayerType = {
  nick: string,
  score: number,
  avatar: string,
  connected: boolean,
  cards: Array<ChoiceType>,
  submitted: AnsweredQuestionType,
};

export type GameType = {
  id: number,
  state: string,
  play_state: string,
  owner: string,
  players: Array<PlayerType>,
  question_master: string,
  question: QuestionType,
  propositions: Array<PartialAnsweredQuestionType>,
};

export type GameTurnType = {
  number: number,
  question_master: string,
  winner: string,
  question: QuestionType,
  answers: Array<LightAnsweredQuestionType>,
};

export type Error = {
  detail: string,
};
