import { AggregateRoot } from '../../ddd/AggregateRoot';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { PlayerEvent } from '../events';
import { CardsDealtEvent } from '../events/CardsDealtEvent';

import { Choice } from './Choice';

export class Player extends AggregateRoot<PlayerEvent> {
  public gameId?: string;

  // todo: optional?
  public cards: Choice[] = [];

  constructor(public readonly nick: string) {
    super();
  }

  addCards(cards: Choice[]) {
    this.cards.push(...cards);
    this.addEvent(new CardsDealtEvent(this, cards));
  }

  removeCards(cards: Choice[]) {
    this.cards = this.cards.filter((card) => !cards.some((c) => c.equals(card)));
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

  toJSON() {
    return {
      id: this.id,
      gameId: this.gameId,
      nick: this.nick,
    };
  }
}