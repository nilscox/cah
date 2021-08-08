import { AggregateRoot } from '../../ddd/AggregateRoot';
import { AlreadyFlushedCardsError } from '../errors/AlreadyFlushedCardsError';
import { InvalidChoicesSelectionError } from '../errors/InvalidChoicesSelectionError';
import { PlayerEvent } from '../events';
import { CardsDealtEvent } from '../events/CardsDealtEvent';

import { Choice } from './Choice';

export class Player extends AggregateRoot<PlayerEvent> {
  public gameId?: string;

  // todo: optional?
  public cards: Choice[] = [];

  public hasFlushed = false;

  constructor(public nick: string) {
    super();
  }

  addCards(cards: Choice[]) {
    this.cards.push(...cards);
    this.addEvent(new CardsDealtEvent(this, cards));
  }

  removeCards(cards: Choice[]) {
    this.cards = this.cards.filter((card) => !cards.some((c) => c.equals(card)));
  }

  flushCards() {
    if (this.hasFlushed) {
      throw new AlreadyFlushedCardsError(this);
    }

    this.removeCards(this.cards);
    this.hasFlushed = true;
  }

  getFirstCards(count: number) {
    return this.cards.slice(0, count);
  }

  getCards(choicesIds: string[]) {
    const selection = [];
    const unknownIds = [];

    for (const id of choicesIds) {
      const card = this.cards.find((card) => card.id === id);

      if (card) {
        selection.push(card);
      } else {
        unknownIds.push(id);
      }
    }

    if (unknownIds.length > 0) {
      throw new InvalidChoicesSelectionError(this, unknownIds);
    }

    return selection;
  }

  toJSON() {
    return {
      id: this.id,
      gameId: this.gameId,
      nick: this.nick,
    };
  }
}
