import React, { useState } from 'react';

import { useInterval } from '../../hooks/useInterval';

type TypedLabelProps = {
  className?: string;
  animate?: boolean;
  children: string;
};

const TypedLabel: React.FC<TypedLabelProps> = ({ className, animate = true, children: label }) => {
  const [index, setIndex] = useState(0);

  const clearInterval = useInterval(
    () => {
      if (!animate) {
        setIndex(label.length);

        return clearInterval();
      }

      let nextIndex = index + 1;

      while (nextIndex < label.length && label[nextIndex] === ' ') {
        nextIndex++;
      }

      if (index === label.length) {
        clearInterval();
      } else {
        setIndex(nextIndex);
      }
    },
    12,
    // don't put animate in the dependencies
    [index],
  );

  return (
    <label className={className} style={{ whiteSpace: 'pre-wrap' }}>
      {label.slice(0, index)}
      <span style={{ color: 'black' }}>{label.slice(index)}</span>
    </label>
  );
};

export default TypedLabel;
