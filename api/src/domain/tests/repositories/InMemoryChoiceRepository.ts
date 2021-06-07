import { Choice } from '../../entities/Choice';
import { Game } from '../../entities/Game';
import { ChoiceRepository } from '../../interfaces/ChoiceRepository';
import { createChoices } from '../creators';

export class InMemoryChoiceRepository implements ChoiceRepository {
  private choices: Choice[] = [];

  async findByIds(ids: number[]): Promise<Choice[]> {
    return this.choices.filter(({ id }) => ids.includes(id));
  }

  async createChoices(_game: Game, choices: Choice[]): Promise<void> {
    this.choices = choices;
  }

  async pickRandomChoices(count: number): Promise<Choice[]> {
    return createChoices(count);
  }

  async getAvailableChoices(_game: Game): Promise<Choice[]> {
    return this.choices;
  }

  getChoices(_game: Game) {
    return this.choices;
  }
}
