import { GameState, PlayState } from "./enums";

export type ChoiceId = string;
export interface ChoiceDto {
  id: ChoiceId;
  text: string;
  caseSensitive: boolean;
}

export type QuestionId = string;
export interface QuestionDto {
  id: QuestionId;
  text: string;
  blanks?: number[];
  numberOfBlanks: number;
  formatted: string;
}

export type AnswerId = string;
export interface AnswerDto {
  id: AnswerId;
  choices: ChoiceDto[];
  formatted: string;
  player?: PlayerId;
}

export type PlayerId = string;
export interface PlayerDto {
  id: PlayerId;
  nick: string;
  isConnected: boolean;
}

export interface FullPlayerDto extends PlayerDto {
  gameId?: GameId;
  cards: ChoiceDto[];
  hasFlushed: boolean;
}

export type GameId = string;
export interface GameDto {
  id: GameId;
  code: string;
  creator: PlayerId;
  players: PlayerDto[];
  gameState: GameState;
}

export interface StartedGameDto extends GameDto {
  gameState: GameState.started;
  playState: PlayState;
  totalQuestions: number;
  questionMaster: PlayerId;
  question: QuestionDto;
  answers: Array<AnswerDto>;
  winner?: PlayerId;
}

export const isGameStartedDto = (game: GameDto): game is StartedGameDto => {
  return game.gameState === GameState.started;
};

export type TurnId = string;
export interface TurnDto {
  id: TurnId;
  number: number;
  questionMaster: PlayerId;
  question: QuestionDto;
  winner: PlayerId;
  answers: AnswerDto[];
}
