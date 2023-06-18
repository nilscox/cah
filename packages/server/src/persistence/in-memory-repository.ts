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

  async save(entity: Entity): Promise<void> {
    this.add(entity);
  }

  all() {
    Array.from(this.items.values());
  }

  add(entity: Entity) {
    this.items.set(entity.id, entity);
  }

  get(id: string) {
    return this.items.get(id);
  }
}
