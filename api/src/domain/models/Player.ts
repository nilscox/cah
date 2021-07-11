import { Entity } from '../../ddd/Entity';
import { InvalidChoicesSelectionError } from '../errors';

import { Choice } from './Choice';

export class Player extends Entity {
  private readonly cards: Choice[] = [];

  constructor(private nick: string) {
    super();
  }

  addCards(cards: Choice[]) {
    this.cards.push(...cards);
  }

  getFirstCards(count: number) {
    return this.cards.slice(0, count);
  }

  getCards(choicesIds?: string[]) {
    if (!choicesIds) {
      return this.cards;
    }

    const cards = this.cards.filter((choice) => choicesIds.includes(choice.id));

    if (cards.length !== choicesIds.length) {
      throw new InvalidChoicesSelectionError(this, choicesIds);
    }

    return cards;
  }
}
