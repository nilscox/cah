import { expect } from 'earljs';

import { CardsDealtEvent } from '../../../domain/events/CardsDealtEvent';
import { createChoice } from '../../../domain/models/Choice';
import { Player } from '../../../domain/models/Player';
import { StubLogger } from '../../../infrastructure/stubs/StubLogger';
import { StubNotifier } from '../../../infrastructure/stubs/StubNotifier';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { PlayerEventsHandler } from './PlayerEventsHandler';

describe('PlayerEventsHandler', () => {
  const logger = new StubLogger();

  let notifier: StubNotifier;
  let handler: PlayerEventsHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ notifier } = deps);

    handler = instanciateHandler(PlayerEventsHandler, deps, logger);
  });

  it('logs the events', () => {
    const player = new Player('player');
    const cards = [createChoice('choice 1')];

    handler.execute(new CardsDealtEvent(player, cards));

    expect(logger.last('info')).toEqual(['notify', player.nick, { type: 'CardsDealt' }]);
    expect(logger.last('debug')).toEqual(['notify', { type: 'CardsDealt', cards: [cards[0].toJSON()] }]);
  });

  it('CardsDealt event', () => {
    const player = new Player('player');
    const cards = [createChoice('choice 2')];

    player.addCards([createChoice('choice 1')]);

    handler.execute(new CardsDealtEvent(player, cards));

    expect(notifier.lastPlayerMessage(player)).toEqual({
      type: 'CardsDealt',
      cards: [
        {
          id: cards[0].id,
          text: cards[0].text,
          caseSensitive: false,
        },
      ],
    });
  });
});
