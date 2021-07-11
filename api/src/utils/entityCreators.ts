import { Entity } from '../ddd/Entity';
import { ValueObject } from '../ddd/ValueObject';

export const creatorsFactory = <E extends Entity | ValueObject<unknown>, Props>(createEntity: (index: number) => E) => {
  const createOne = (overrides?: Partial<Props>, index = 0) => {
    return Object.assign(createEntity(index), { ...overrides });
  };

  const createMany = (count: number, overrides?: (index: number) => Partial<Props>) => {
    return Array(count)
      .fill(null)
      .map((_, n) => createOne(overrides?.(n), n));
  };

  return { createOne, createMany };
};
