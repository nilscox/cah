export const hasId = <T extends { id: string }>(id: string) => {
  return (item: T) => item.id === id;
};
