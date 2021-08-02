import { expect } from 'chai';

import { CardsDealtEvent } from '../../../domain/events/CardsDealtEvent';
import { Choice } from '../../../domain/models/Choice';
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
    const cards = [new Choice('choice 1')];

    handler.execute(new CardsDealtEvent(player, cards));

    expect(logger.last('info')).to.eql(['notify', player.nick, 'CardsDealt']);
    expect(logger.last('verbose')).to.eql(['notify', { type: 'CardsDealt', cards: [cards[0].toJSON()] }]);
  });

  it('CardsDealt event', () => {
    const player = new Player('player');
    const cards = [new Choice('choice 2')];

    player.addCards([new Choice('choice 1')]);

    handler.execute(new CardsDealtEvent(player, cards));

    expect(notifier.lastPlayerMessage(player)).to.eql({
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
