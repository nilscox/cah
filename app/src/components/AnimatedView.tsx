import React, { useState, useEffect } from 'react';

import { useSpring, animated } from 'react-spring';
import { toast } from 'react-toastify';

type AnimatedViewsProps = {
  views: { [key: string]: React.ReactNode };
  current: string;
};

const AnimatedViews: React.FC<AnimatedViewsProps> = ({ views, current, children }) => {
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
      <animated.div style={{ height: '100%', ...transition }}>
        { views[view] }
        { children }
      </animated.div>
    </>
  );
};

export default AnimatedViews;
