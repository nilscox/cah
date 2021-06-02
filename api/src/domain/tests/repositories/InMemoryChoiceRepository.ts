import { Choice } from '../../entities/Choice';
import { Game } from '../../entities/Game';
import { ChoiceRepository } from '../../interfaces/ChoiceRepository';
import { createChoices } from '../creators';

export class InMemoryChoiceRepository implements ChoiceRepository {
  private choices = new Map<Game, Choice[]>();

  async createChoices(game: Game, choices: Choice[]): Promise<void> {
    this.choices.set(game, choices);
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    return createChoices(count);
  }

  async getAvailableChoices(game: Game): Promise<Choice[]> {
    return this.choices.get(game) ?? [];
  }

  getChoices(game: Game) {
    return this.choices.get(game);
  }
}
