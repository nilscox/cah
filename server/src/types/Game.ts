import { Player } from './Player';
import { Question } from './Question';
import { Choice } from './Choice';

export interface Answer {
  player: string;
  question: Question;
  choices: Choice[];
}

export interface Turn {
  number: number;
  question: Question;
  questionMaster: string;
  winner: string;
  answers: Answer[];
}

export interface Game {
  id: string;
  state: 'idle' | 'started' | 'finished';
  players: Player[];
  questions: Question[];
  choices: Choice[];
  playState?: 'players_answer' | 'question_master_selection' | 'end_of_turn';
  questionMaster?: string;
  question?: Question;
  answers?: Answer[];
  turns?: Turn[];
  scores?: { [player: string]: number };
}
