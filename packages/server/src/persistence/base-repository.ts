import { BaseEntity } from './base-entity';

export interface BaseRepository<Entity extends BaseEntity> {
  findById(id: string): Promise<Entity | undefined>;
  findByIdOrFail(id: string): Promise<Entity>;
  save(entity: Entity): Promise<void>;
}
