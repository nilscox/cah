import { Entity } from '../ddd/Entity';
import { ValueObject } from '../ddd/ValueObject';

import { array } from './array';

export const creatorsFactory = <E extends Entity | ValueObject<unknown>, Props>(createEntity: (index: number) => E) => {
  const createOne = (overrides?: Partial<Props>, index = 0) => {
    return Object.assign(createEntity(index), { ...overrides });
  };

  const createMany = (count: number, overrides?: (index: number) => Partial<Props>) => {
    return array(count, (n) => createOne(overrides?.(n), n));
  };

  return { createOne, createMany };
};
