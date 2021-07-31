import { Choice } from '../../domain/models/Choice';
import { Game } from '../../domain/models/Game';
import { Question } from '../../domain/models/Question';
import { Turn } from '../../domain/models/Turn';

export interface GameRepository {
  findAll(): Promise<Game[]>;
  findGameById(id: string): Promise<Game | undefined>;
  findGameByCode(code: string): Promise<Game | undefined>;
  findGameForPlayer(playerId: string): Promise<Game | undefined>;
  addQuestions(gameId: string, questions: Question[]): Promise<void>;
  findNextAvailableQuestion(gameId: string): Promise<Question | undefined>;
  addChoices(gameId: string, choices: Choice[]): Promise<void>;
  findAvailableChoices(gameId: string): Promise<Choice[]>;
  markChoicesUnavailable(choiceIds: string[]): Promise<void>;
  addTurn(gameId: string, turn: Turn): Promise<void>;
  findTurns(gameId: string): Promise<Turn[]>;
  save(game: Game): Promise<void>;
}
