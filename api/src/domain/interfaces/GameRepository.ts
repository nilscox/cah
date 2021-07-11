import { Choice } from '../models/Choice';
import { Game } from '../models/Game';
import { Question } from '../models/Question';

export interface GameRepository {
  findGameById(id: string): Promise<Game | undefined>;
  findGameForPlayer(playerId: string): Promise<Game | undefined>;
  addQuestions(gameId: string, questions: Question[]): Promise<void>;
  addChoices(gameId: string, choices: Choice[]): Promise<void>;
  save(game: Game): Promise<void>;
}
