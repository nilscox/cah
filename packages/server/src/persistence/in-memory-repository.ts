import { BaseEntity } from './base-entity';
import { BaseRepository } from './base-repository';

const clone = <T>(value: T): T => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(JSON.stringify(value));
};

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
    this.set(entity);
  }

  all() {
    Array.from(this.items.values()).map(clone);
  }

  set(entity: Entity) {
    this.items.set(entity.id, clone(entity));
  }

  get(id: string) {
    return clone(this.items.get(id));
  }
}
