import { GameState, PlayState } from "./enums";

export interface ChoiceDto {
  text: string;
}

export interface PlayerDto {
  id: string;
  nick: string;
  isConnected: boolean;
}

export interface FullPlayerDto extends PlayerDto {
  gameId?: string;
  cards: ChoiceDto[];
}

export interface QuestionDto {
  text: string;
  blanks?: number[];
  numberOfBlanks: number;
  formatted: string;
}

export interface AnswerDto {
  id: string;
  player?: string;
  choices: string[];
  formatted: string;
}

export interface GameDto {
  id: string;
  code: string;
  players: PlayerDto[];
  gameState: GameState;
  playState?: PlayState;
  questionMaster?: string;
  question?: QuestionDto;
  answers?: AnswerDto[];
  winner?: string;
}
