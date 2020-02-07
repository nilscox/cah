import { PlayerDTO } from './player.dto';
import { QuestionDTO } from './question.dto';
import { TurnDTO } from './turn.dto';
import { AnswerDTO } from './answer.dto';

export interface GameDTO {
  id: string;
  state: 'idle' | 'started' | 'finished';
  players: PlayerDTO[];
  playState?: 'players_answer' | 'question_master_selection' | 'end_of_turn';
  questionMaster?: string;
  question?: QuestionDTO;
  answered?: string[];
  answers?: AnswerDTO[];
  turn?: number;
  turns?: TurnDTO[];
  scores?: { [player: string]: number };
}
