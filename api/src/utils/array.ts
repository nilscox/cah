export const array = <T>(count: number, create: (index: number) => T): T[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => create(index));
};
