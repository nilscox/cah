import React from 'react';

import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { FadeIn } from '../../components/layout/Fade';
import { useTimeout } from '../../hooks/useTimeout';
import { fontSize, fontWeight, spacing } from '../../styles/theme';

const StyledWord = styled(FadeIn)`
  font-size: ${fontSize('title')};
  font-weight: ${fontWeight('thin')};
  line-height: 3.5rem;
  letter-spacing: ${spacing(1)};
`;

const WordFirstLetter = styled.span`
  font-weight: ${fontWeight('bold')};
`;

type WordProps = {
  word: string;
  delay: number;
};

const Word: React.FC<WordProps> = ({ word, delay }) => (
  <StyledWord duration="slow" delay={delay}>
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
  const duration = theme.durations.slow;

  useTimeout(onRest, 3 * duration, []);

  return (
    <h1 className={className}>
      <Word word="Cards" delay={0} />
      <Word word="Against" delay={2} />
      <Word word="Humanity" delay={4} />
    </h1>
  );
};

export default MainTitle;
