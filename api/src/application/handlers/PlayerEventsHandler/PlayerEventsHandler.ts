import { EventDto } from '../../../../../shared/events';
import { EventHandler } from '../../../ddd/EventHandler';
import { PlayerEvent } from '../../../domain/events';
import { Player } from '../../../domain/models/Player';
import { Logger } from '../../interfaces/Logger';
import { Notifier } from '../../interfaces/Notifier';

export class PlayerEventsHandler implements EventHandler<PlayerEvent> {
  constructor(private readonly logger: Logger, private readonly notifier: Notifier) {
    this.logger.setContext('PlayerEvent');
  }

  execute(event: PlayerEvent) {
    if (event.type === 'CardsDealt') {
      this.notify(event.player, {
        type: event.type,
        cards: event.cards.map((choice) => choice.toJSON()),
      });
    }
  }

  notify(player: Player, event: EventDto) {
    this.logger.info('notify', player.nick, { type: event.type });
    this.logger.debug('notify', event);

    this.notifier.notifyPlayer(player, event);
  }
}
