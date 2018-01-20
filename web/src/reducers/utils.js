const isFunc = o => typeof o === 'function';

export const append = (list, elem) => {
  return [ ...list, elem ];
};

export const remove = (list, elem) => {
  const idx = isFunc(elem)
    ? list.findIndex(elem)
    : list.indexOf(elem);

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
    isFunc(elem) ? elem(list[idx]) : elem,
    ...list.slice(idx + 1),
  ];
};
