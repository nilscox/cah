export const arrayToObject = <T extends { id: string }>(array: T[]): Record<string, T> => {
  return array.reduce((obj, item) => ({ ...obj, [item.id]: item }), {});
};
