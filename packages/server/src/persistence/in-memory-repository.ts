import { clone } from 'src/utils/clone';

import { BaseEntity } from './base-entity';
import { BaseRepository } from './base-repository';

export class InMemoryRepository<Entity extends BaseEntity> implements BaseRepository<Entity> {
  private items = new Map<string, Entity>();

  async findById(id: string): Promise<Entity | undefined> {
    return this.get(id);
  }

  async findByIdOrFail(id: string): Promise<Entity> {
    const item = this.items.get(id);

    if (!item) {
      throw new Error('Entity not found');
    }

    return Promise.resolve(item);
  }

  async save(...entities: Entity[]): Promise<void> {
    entities.forEach((entity) => this.set(entity));
  }

  all() {
    return Array.from(this.items.values()).map(clone);
  }

  filter(predicate: (entity: Entity) => boolean) {
    return this.all().filter(predicate);
  }

  find(predicate: (entity: Entity) => boolean) {
    return this.all().find(predicate);
  }

  set(entity: Entity) {
    this.items.set(entity.id, clone(entity));
  }

  get(id: string) {
    const item = this.items.get(id);

    if (item) {
      return clone(item);
    }
  }
}
