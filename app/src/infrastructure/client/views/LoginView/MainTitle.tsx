import React, { useState } from 'react';

import styled from 'styled-components';

import { useTimeout } from '../../hooks/useTimeout';
import { fontSize, fontWeight, spacing } from '../../styles/theme';

const StyledWord = styled.div`
  font-size: ${fontSize('title')};
  font-weight: ${fontWeight('thin')};
  line-height: 2.2rem;
  letter-spacing: ${spacing(0.8)};
  transition-property: opacity;
  transition-timing-function: ease-in-out;
  opacity: 0;
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
    <StyledWord style={{ opacity, transitionDelay: `${delay}ms`, transitionDuration: `${duration}ms` }}>
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
  useTimeout(onRest, 4500, []);

  return (
    <h1 className={className}>
      <Word word="Cards" delay={1000} duration={1500} />
      <Word word="Against" delay={1500} duration={2500} />
      <Word word="Humanity" delay={2500} duration={2500} />
    </h1>
  );
};

export default MainTitle;
