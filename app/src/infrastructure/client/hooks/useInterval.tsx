import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useInterval = (cb: EffectCallback, ms: number, deps: DependencyList = []) => {
  const value = useRef<NodeJS.Timer>();

  useEffect(() => {
    const interval = setInterval(cb, ms);

    value.current = interval;

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return () => value.current && clearInterval(value.current);
};
