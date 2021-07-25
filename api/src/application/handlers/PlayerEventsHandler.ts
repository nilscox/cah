import { EventDto } from '../../../../shared/events';
import { EventHandler } from '../../ddd/EventHandler';
import { PlayerEvent } from '../../domain/events';
import { Player } from '../../domain/models/Player';
import { Notifier } from '../interfaces/Notifier';

export class PlayerEventsHandler implements EventHandler<PlayerEvent> {
  constructor(private readonly notifier: Notifier) {}

  execute(event: PlayerEvent) {
    if (event.type === 'CardsDealt') {
      this.notify(event.player, {
        type: event.type,
        cards: event.cards.map((choice) => choice.toJSON()),
      });
    }
  }

  notify(player: Player, event: EventDto) {
    this.notifier.notifyPlayer(player, event);
  }
}
