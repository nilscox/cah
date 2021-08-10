import { GameState, PlayState } from "./enums";

export interface ChoiceDto {
  id: string;
  text: string;
  caseSensitive: boolean;
}

export interface PlayerDto {
  id: string;
  nick: string;
  isConnected: boolean;
}

export interface FullPlayerDto extends PlayerDto {
  gameId?: string;
  cards: ChoiceDto[];
  hasFlushed: boolean;
}

export interface QuestionDto {
  text: string;
  blanks?: number[];
  numberOfBlanks: number;
  formatted: string;
}

export interface AnonymousAnswerDto {
  id: string;
  choices: ChoiceDto[];
  formatted: string;
}

export interface AnswerDto extends AnonymousAnswerDto {
  player: string;
}

export interface GameDto {
  id: string;
  creator: string;
  code: string;
  players: PlayerDto[];
  gameState: GameState;
  playState?: PlayState;
  totalQuestions?: number;
  questionMaster?: string;
  question?: QuestionDto;
  answers?: Array<AnonymousAnswerDto | AnswerDto>;
  winner?: string;
}

export interface TurnDto {
  number: number;
  questionMaster: string;
  question: QuestionDto;
  winner: string;
  answers: AnswerDto[];
}
