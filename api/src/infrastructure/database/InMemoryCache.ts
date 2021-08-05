import _ from 'lodash';

import { ClassType } from '../../utils/types';

export type InMemoryEntity = {
  id: string;
};

export class InMemoryCache {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map = new Map<unknown, Map<string, any>>();

  save<T extends InMemoryEntity>(type: ClassType<T>, value: T | T[]): void {
    if (Array.isArray(value)) {
      return value.forEach((value) => this.save(type, value));
    }

    if (!this.map.has(type)) {
      this.map.set(type, new Map());
    }

    this.map.set(type, this.map.get(type)!.set(value.id, value));
  }

  all<T extends InMemoryEntity>(type: ClassType<T>): T[] {
    return Array.from<T>(this.map.get(type)?.values() ?? []);
  }

  allInIds<T extends InMemoryEntity>(type: ClassType<T>, ids: string[]): T[] {
    return this.all(type).filter(({ id }) => ids.includes(id));
  }

  get<T extends InMemoryEntity>(type: ClassType<T>, id: string): T | undefined {
    return this.map.get(type)?.get(id);
  }

  getExisting<T extends InMemoryEntity>(type: ClassType<T>, id: string): T {
    const entity = this.get(type, id);

    if (!entity) {
      throw new Error(`InMemoryCache: ${type.name} with id ${id} does not exist`);
    }

    return entity;
  }

  remove<T extends InMemoryEntity>(type: ClassType<T>, id: string): void {
    this.map.get(type)?.delete(id);
  }

  // most beautiful function <3
  toJSON() {
    return Array.from(this.map.entries()).reduce(
      (obj, [type, map]) => ({
        ...obj,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [(type as any).name]: Array.from(map.entries()).reduce(
          (obj, [id, value]) => ({
            ...obj,
            [id]: value,
          }),
          {},
        ),
      }),
      {},
    );
  }
}
