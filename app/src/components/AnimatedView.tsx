import React, { useState, useEffect } from 'react';

import { useSpring, animated } from 'react-spring';
import { toast } from 'react-toastify';

type AnimatedViewsProps = {
  style?: React.CSSProperties;
  views: { [key: string]: React.ReactNode };
  current: string;
};

const AnimatedViews: React.FC<AnimatedViewsProps> = ({ style, views, current }) => {
  const [view, setView] = useState(current);
  const [nextView, setNextView] = useState<string>();

  useEffect(() => {
    if (current !== view)
      setNextView(current)
  }, [current]);

  const transition = useSpring({
    from: { opacity: 1 },
    to: { opacity: nextView ? 0 : 1 },
    onRest: () => {
      if (nextView) {
        setView(nextView);
        setNextView(undefined);
        toast.dismiss();
      }
    },
  });

  return (
    <>
      <animated.div style={{ ...style, ...transition }}>
        { views[view] }
      </animated.div>
    </>
  );
};

export default AnimatedViews;
