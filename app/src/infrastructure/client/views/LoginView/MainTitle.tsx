import React, { useState } from 'react';

import styled, { useTheme } from 'styled-components';

import { useTimeout } from '../../hooks/useTimeout';
import { fontSize, fontWeight, spacing, transition } from '../../styles/theme';

type StyledWordProps = {
  opacity: number;
  delay: number;
  duration: number;
};

const StyledWord = styled.div<StyledWordProps>`
  font-size: ${fontSize('title')};
  font-weight: ${fontWeight('thin')};
  line-height: 2.2rem;
  letter-spacing: ${spacing(0.8)};
  transition: ${({ delay, duration }) => transition('opacity', { duration, delay })};
  opacity: ${({ opacity }) => opacity};
`;

const WordFirstLetter = styled.span`
  font-weight: ${fontWeight('bold')};
`;

type WordProps = {
  word: string;
  delay: number;
  duration: number;
};

const Word: React.FC<WordProps> = ({ word, delay, duration }) => {
  const [opacity, setOpacity] = useState(0);

  useTimeout(() => setOpacity(1), 0);

  return (
    <StyledWord opacity={opacity} delay={delay} duration={duration}>
      <WordFirstLetter>{word[0]}</WordFirstLetter>
      {word.slice(1)}
    </StyledWord>
  );
};

type MainTitleProps = {
  className?: string;
  onRest: () => void;
};

const MainTitle: React.FC<MainTitleProps> = ({ className, onRest }) => {
  const theme = useTheme();
  const slow = theme.transition.durations.slow;

  useTimeout(onRest, 4.5 * slow, []);

  return (
    <h1 className={className}>
      <Word word="Cards" delay={slow} duration={1.5 * slow} />
      <Word word="Against" delay={1.5 * slow} duration={2.5 * slow} />
      <Word word="Humanity" delay={2 * slow} duration={2.5 * slow} />
    </h1>
  );
};

export default MainTitle;
