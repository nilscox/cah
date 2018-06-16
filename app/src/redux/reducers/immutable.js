export const replace = (array, predicate, value) => {
  const idx = array.findIndex(predicate);

  if (idx < 0)
    return array;

  const result = array.slice();

  result.splice(idx, 1, value);

  return result;
};

export const replaceOrPush = (array, predicate, value) => {
  const idx = array.findIndex(predicate);
  const result = array.slice();

  if (idx < 0)
    result.push(value);
  else
    result.splice(idx, 1, value);

  return result;
};

export const remove = (array, predicate) => {
  const idx = array.findIndex(predicate);

  if (idx < 0)
    return array;

  const result = array.slice();

  result.splice(idx, 1);

  return result;
};

export const merge = (array, predicate, obj) => {
  const idx = array.findIndex(predicate);

  if (idx < 0)
    return array;

  const result = array.slice();

  result.splice(idx, 1, { ...result[idx], ...obj });

  return result;
};
