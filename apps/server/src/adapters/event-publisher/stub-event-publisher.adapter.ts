import { DomainEvent } from 'src/interfaces';

import { type EventPublisherPort } from './event-publisher.port.ts';

export class StubEventPublisherAdapter extends Array<DomainEvent> implements EventPublisherPort {
  publish = this.push.bind(this);
}
