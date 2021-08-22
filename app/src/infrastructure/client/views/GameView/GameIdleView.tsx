import React, { useState } from 'react';

import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';

import { Player } from '../../../../domain/entities/Player';
import { startGame } from '../../../../domain/usecases/game/startGame/startGame';
import { selectCanStartGame, selectPlayers } from '../../../../store/selectors/gameSelectors';
import Button from '../../components/elements/Button';
import { Input } from '../../components/elements/Input';
import { Select } from '../../components/elements/Select';
import { BottomAction } from '../../components/layout/BottomAction';
import { Box } from '../../components/layout/Box';
import { Center } from '../../components/layout/Center';
import { Flex } from '../../components/layout/Flex';
import { useGame } from '../../hooks/useGame';
import { fontSize } from '../../styles/theme';

const GameCode = styled(Center)`
  font-size: ${fontSize('title')};
`;

const PlayersList = styled.ul``;

const PlayerItem = styled.li<{ connected: boolean }>`
  opacity: ${({ connected }) => !connected && 0.5};
`;

export const GameIdleView: React.FC = () => {
  const dispatch = useDispatch();
  const canStart = useSelector(selectCanStartGame);

  const game = useGame();
  const players = useSelector(selectPlayers);

  const [numberOfTurns, setNumberOfTurns] = useState('50');
  const [initialQuestionMaster, setInitialQuestionMaster] = useState<Player | null>(null);

  return (
    <>
      <Flex flex={1} padding={2}>
        <GameCode minHeight={12}>{game.code}</GameCode>

        <p>Attendez que tous les joueurs soient listés ci-dessous, et cliquez sur démarrer pour lancer la partie.</p>

        <PlayersList>
          {players.map((player) => (
            <PlayerItem key={player.nick} connected={player.isConnected}>
              {player.nick}
            </PlayerItem>
          ))}
        </PlayersList>

        <GameConfiguration
          numberOfTurns={numberOfTurns}
          setNumberOfTurns={setNumberOfTurns}
          initialQuestionMaster={initialQuestionMaster}
          setInitialQuestionMaster={setInitialQuestionMaster}
        />
      </Flex>

      <BottomAction visible={canStart}>
        <Button onClick={() => dispatch(startGame(initialQuestionMaster, Number(numberOfTurns)))}>Démarrer</Button>
      </BottomAction>
    </>
  );
};

type GameConfigurationProps = {
  numberOfTurns: string;
  setNumberOfTurns: (value: string) => void;
  initialQuestionMaster: Player | null;
  setInitialQuestionMaster: (value: Player | null) => void;
};

const GameConfiguration: React.FC<GameConfigurationProps> = ({
  numberOfTurns,
  setNumberOfTurns,
  initialQuestionMaster,
  setInitialQuestionMaster,
}) => {
  const players = useSelector(selectPlayers);
  const canStart = useSelector(selectCanStartGame);

  if (!canStart) {
    return null;
  }

  const findPlayer = (id: string) => players.find((player) => player.id === id);

  const handleNumberOfTurnsChange = (value: string) => {
    if (value === '') {
      setNumberOfTurns('');
    } else {
      setNumberOfTurns(value.replace(/[^0-9]/g, ''));
    }
  };

  return (
    <>
      <Box marginY={1}>
        <Box>Nombre de tours</Box>
        <Input type="number" min={1} value={numberOfTurns} fullWidth={false} onTextChange={handleNumberOfTurnsChange} />
      </Box>

      <Box marginY={1}>
        <Box>Premier question master</Box>
        <Select
          value={initialQuestionMaster?.id ?? ''}
          onChange={(e) => setInitialQuestionMaster(findPlayer(e.target.value) ?? null)}
        >
          <option value="">Aléatoire</option>

          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.nick}
            </option>
          ))}
        </Select>
      </Box>
    </>
  );
};
