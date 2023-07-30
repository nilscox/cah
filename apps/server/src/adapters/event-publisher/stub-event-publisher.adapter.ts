import { DomainEvent } from 'src/interfaces';

import { EventPublisherPort } from './event-publisher.port';

export class StubEventPublisherAdapter extends Array<DomainEvent> implements EventPublisherPort {
  publish = this.push.bind(this);
}
