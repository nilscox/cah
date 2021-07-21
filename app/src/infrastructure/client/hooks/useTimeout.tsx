import { DependencyList, EffectCallback, useEffect } from 'react';

export const useTimeout = (cb: EffectCallback, ms: number, deps: DependencyList = []) => {
  useEffect(() => {
    const timeout = setTimeout(cb, ms);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deps]);
};
