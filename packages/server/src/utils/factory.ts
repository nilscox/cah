export type Factory<T> = (overrides?: Partial<T>) => T;
export type AsyncFactory<T> = (overrides?: Partial<T>) => Promise<T>;

export const factory = <T>(getDefaultValues: () => T): Factory<T> => {
  return (overrides) => ({ ...getDefaultValues(), ...overrides });
};
