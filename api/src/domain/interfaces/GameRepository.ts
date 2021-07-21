import { Choice } from '../models/Choice';
import { Game } from '../models/Game';
import { Question } from '../models/Question';
import { Turn } from '../models/Turn';

export interface GameRepository {
  findAll(): Promise<Game[]>;
  findGameById(id: string): Promise<Game | undefined>;
  findGameByCode(code: string): Promise<Game | undefined>;
  findGameForPlayer(playerId: string): Promise<Game | undefined>;
  addQuestions(gameId: string, questions: Question[]): Promise<void>;
  findNextAvailableQuestion(gameId: string): Promise<Question | undefined>;
  addChoices(gameId: string, choices: Choice[]): Promise<void>;
  findAvailableChoices(gameId: string): Promise<Choice[]>;
  addTurn(gameId: string, turn: Turn): Promise<void>;
  save(game: Game): Promise<void>;
}
