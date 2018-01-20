export const append = (list, elem) => {
  return [ ...list, elem ];
};

export const remove = (list, func) => {
  const idx = list.findIndex(func);

  if (idx < 0)
    return list;

  return [
    ...list.slice(0, idx),
    ...list.slice(idx + 1),
  ];
};

export const replace = (list, elem, func) => {
  const idx = list.findIndex(func);

  if (idx < 0)
    return list;

  return [
    ...list.slice(0, idx),
    typeof elem === 'function' ? elem(list[idx]) : elem,
    ...list.slice(idx + 1),
  ];
};
