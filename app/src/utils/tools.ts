export const replace = <T>(array: T[], predicate: (element: T) => boolean, updates: Partial<T>): T[] => {
  const idx = array.findIndex(predicate);

  if (idx < 0) {
    return array;
  }

  // prettier-ignore
  return [
    ...array.slice(0, idx),
    { ...array[idx], ...updates },
    ...array.slice(idx + 1),
  ];
};
