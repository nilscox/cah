import { Choice } from 'src/entities';

export interface ChoiceRepository {
  findPlayersCards(gameId: string): Promise<Record<string, Choice[]>>;
  findPlayerCards(playerId: string): Promise<Choice[]>;
  findAvailable(gameId: string, count: number): Promise<Choice[]>;
  insertMany(choices: Choice[]): Promise<void>;
  updateMany(choices: Choice[]): Promise<void>;
}
