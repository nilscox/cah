import { Choice } from '../../entities/Choice';
import { Game } from '../../entities/Game';
import { ChoiceRepository } from '../../interfaces/ChoiceRepository';

import { InMemoryRepository } from './InMemoryRepository';

export class InMemoryChoiceRepository extends InMemoryRepository<Choice> implements ChoiceRepository {
  async findByIds(ids: number[]): Promise<Choice[]> {
    return [...this.items.values()].filter(({ id }) => ids.includes(id));
  }

  async createChoices(_game: Game, choices: Choice[]): Promise<void> {
    this.set(choices);
  }

  async getAvailableChoices(): Promise<Choice[]> {
    return [...this.items.values()];
  }
}
