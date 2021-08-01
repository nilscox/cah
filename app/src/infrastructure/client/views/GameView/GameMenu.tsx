import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { flushCards } from '../../../../domain/usecases/game/flushCards/flushCards';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import Button from '../../components/elements/Button';
import { Box } from '../../components/layout/Box';

const GameMenu: React.FC = () => {
  const game = useSelector(selectGame);
  const dispatch = useDispatch();

  return (
    <Box padding={2}>
      <Box paddingY={2}>Code de la partie : {game.code}</Box>
      <Box paddingY={2}>
        <Button onClick={() => dispatch(flushCards())}>Changer toutes ses cartes</Button>
      </Box>
    </Box>
  );
};

export default GameMenu;
