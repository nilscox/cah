import { expect } from 'chai';

import { CardsDealtEvent } from '../../domain/events/CardsDealtEvent';
import { Choice } from '../../domain/models/Choice';
import { Player } from '../../domain/models/Player';
import { StubNotifier } from '../../infrastructure/stubs/StubNotifier';

import { PlayerEventsHandler } from './PlayerEventsHandler';

describe('PlayerEventsHandler', () => {
  let notifier: StubNotifier;
  let handler: PlayerEventsHandler;

  beforeEach(() => {
    notifier = new StubNotifier();
    handler = new PlayerEventsHandler(notifier);
  });

  it('CardsDealt event', () => {
    const player = new Player('player');
    const cards = [new Choice('choice 2')];

    player.addCards([new Choice('choice 1')]);

    handler.execute(new CardsDealtEvent(player, cards));

    expect(notifier.playerMessages(player)).to.deep.include({
      type: 'CardsDealt',
      cards: [
        {
          id: cards[0].id,
          text: cards[0].text,
        },
      ],
    });
  });
});
