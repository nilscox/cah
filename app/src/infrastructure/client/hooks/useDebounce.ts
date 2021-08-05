import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, time: number) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    if (debounced === value) {
      return;
    }

    const timeout = setTimeout(() => setDebounced(value), time);

    return () => clearTimeout(timeout);
  }, [debounced, value, time]);

  return debounced;
};
