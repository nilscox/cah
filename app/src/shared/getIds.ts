export const getIds = <T extends { id: string }>(arr: T[]) => {
  return arr.map(({ id }) => id);
};
