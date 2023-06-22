export const toObject = <T, V>(
  array: T[],
  getKey: (item: T) => string,
  getValue: (item: T) => V
): Record<string, V> => {
  return array.reduce(
    (obj, item) => ({
      ...obj,
      [getKey(item)]: getValue(item),
    }),
    {}
  );
};
