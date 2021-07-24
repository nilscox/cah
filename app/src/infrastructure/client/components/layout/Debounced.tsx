import React, { useState } from 'react';

import { useTimeout } from '../../hooks/useTimeout';

type DebouncedProps = {
  delay: number;
};

export const Debounced: React.FC<DebouncedProps> = ({ delay, children }) => {
  const [show, setShow] = useState(false);

  useTimeout(() => setShow(true), delay);

  if (!show) {
    return null;
  }

  return <>{children}</>;
};
