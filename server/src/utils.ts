export const randomItem = <T extends any>(items: T[], remove = false) => {
  const idx = Math.floor(Math.random() * items.length);
  const item = items[idx];

  if (remove)
    items.splice(idx, 1);

  return item;
};

export const shuffle = <T extends any>(items: T[]) => {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}
