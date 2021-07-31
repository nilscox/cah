import React from 'react';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { FadeIn } from '../../components/layout/FadeIn';
import { useTimeout } from '../../hooks/useTimeout';
import { fontSize, fontWeight, spacing } from '../../styles/theme';

const StyledWord = styled(FadeIn)`
  font-size: ${fontSize('title')};
  font-weight: ${fontWeight('thin')};
  line-height: 2.2rem;
  letter-spacing: ${spacing(0.8)};
`;

const WordFirstLetter = styled.span`
  font-weight: ${fontWeight('bold')};
`;

type WordProps = {
  word: string;
  delay: number;
  duration: number;
};

const Word: React.FC<WordProps> = ({ word, delay, duration }) => (
  <StyledWord speed="slow" delay={delay} factor={duration}>
    <WordFirstLetter>{word[0]}</WordFirstLetter>
    {word.slice(1)}
  </StyledWord>
);

type MainTitleProps = {
  className?: string;
  onRest: () => void;
};

const MainTitle: React.FC<MainTitleProps> = ({ className, onRest }) => {
  const theme = useTheme();
  const duration = theme.animations.durations.slow;

  useTimeout(onRest, 3.5 * duration, []);

  return (
    <h1 className={className}>
      <Word word="Cards" delay={0} duration={1.5} />
      <Word word="Against" delay={0.5} duration={2.5} />
      <Word word="Humanity" delay={1} duration={3.5} />
    </h1>
  );
};

export default MainTitle;
