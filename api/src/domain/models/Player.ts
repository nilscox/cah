import { AggregateRoot } from '../../ddd/AggregateRoot';
import { DomainEvent } from '../../ddd/EventPublisher';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';

import { Choice } from './Choice';

class CardsDealtEvent implements DomainEvent {
  readonly type = 'CardsDealt';
  constructor(public readonly player: Player) {}
}

export class Player extends AggregateRoot {
  private readonly cards: Choice[] = [];

  constructor(private nick: string) {
    super();
  }

  addCards(cards: Choice[]) {
    this.cards.push(...cards);
    this.addEvent(new CardsDealtEvent(this));
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
