import React from 'react';

import { useSelector } from 'react-redux';

import { selectGame } from '../../../../store/selectors/gameSelectors';
import { Box } from '../../components/layout/Box';

const GameMenu: React.FC = () => {
  const game = useSelector(selectGame);

  return (
    <Box padding={2}>
      <Box paddingY={2}>Code de la partie : {game.code}</Box>
    </Box>
  );
};

export default GameMenu;
