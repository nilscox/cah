import { clone } from 'src/utils/clone';

import { BaseEntity } from './base-entity';

export class InMemoryRepository<Entity extends BaseEntity> {
  private items = new Map<string, Entity>();

  all() {
    return Array.from(this.items.values()).map(clone);
  }

  filter(predicate: (entity: Entity) => boolean) {
    return this.all().filter(predicate);
  }

  find(predicate: (entity: Entity) => boolean) {
    return this.all().find(predicate);
  }

  set(...entities: Entity[]) {
    entities.forEach((entity) => this.items.set(entity.id, clone(entity)));
  }

  get(id: string) {
    const item = this.items.get(id);

    if (item) {
      return clone(item);
    }
  }
}
