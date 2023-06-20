type Factory<T> = (overrides?: Partial<T>) => T;

export const factory = <T>(getDefaultValues: () => T): Factory<T> => {
  return (overrides) => ({ ...getDefaultValues(), ...overrides });
};
