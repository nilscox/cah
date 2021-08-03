import React, { useEffect, useState } from 'react';

import { Theme, useTheme } from '@emotion/react';
import { animated, useSpring } from 'react-spring';

export type FadeProps = {
  show: boolean;
  appear?: boolean;
  duration?: keyof Theme['durations'];
  delay?: number;
  onRest?: () => void;
};

const useFirstRender = () => {
  const [first, setFirst] = useState(true);

  useEffect(() => setFirst(false), []);

  return first;
};

export const Fade: React.FC<FadeProps> = ({ show, appear, duration: dur = 'default', delay = 0, onRest, children }) => {
  const theme = useTheme();
  const duration = theme.durations[dur];
  const firstRender = useFirstRender();

  const props = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    immediate: firstRender && !appear,
    reverse: !show,
    delay: delay * theme.durations.default,
    config: {
      duration,
    },
    onRest,
  });

  return <animated.div style={props}>{children}</animated.div>;
};

export const FadeIn: React.FC<Omit<FadeProps, 'show'>> = ({ ...props }) => {
  return <Fade show appear {...props} />;
};
