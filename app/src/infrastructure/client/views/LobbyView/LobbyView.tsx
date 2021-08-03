import React, { useState } from 'react';

import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';

import { createGame } from '../../../../domain/usecases/game/createGame/createGame';
import { joinGame } from '../../../../domain/usecases/game/joinGame/joinGame';
import Button from '../../components/elements/Button';
import { Icon } from '../../components/elements/Icon';
import SubmittableInput from '../../components/elements/SubmittableInput';
import { Center } from '../../components/layout/Center';
import { Fade } from '../../components/layout/Fade';
import ChevronRight from '../../icons/chevron-right.svg';
import { color, spacing, transition } from '../../styles/theme';
import { View } from '../View';

import { Part } from './Part';
import { ViewHeader } from './ViewHeader';

const JoinGame: React.FC = () => {
  const dispatch = useDispatch();
  const [code, setCode] = useState('');

  return (
    <>
      <p>Entrez le code de la partie à rejoindre.</p>
      <p>Si vous n'avez pas de code, l'un des joueur doit créer une partie.</p>
      <Center flex={1}>
        <SubmittableInput
          placeholder="Code de partie"
          value={code}
          onTextChange={setCode}
          onSubmit={() => dispatch(joinGame(code))}
        />
      </Center>
    </>
  );
};

const CreateGame: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <>
      <p>En cliquant sur continuer, vous allez créer une partie de Cards Against Humanity.</p>
      <p>Un code sera généré pour que les autres joueurs puissent vous rejoindre.</p>
      <Center flex={1}>
        <Button onClick={() => dispatch(createGame())}>
          Continuer <Icon as={ChevronRight} />
        </Button>
      </Center>
    </>
  );
};

const Separator = styled.hr<{ show: boolean }>`
  border: 0;
  border-top: ${({ show }) => (show ? 1 : 0)}px solid ${color('border')};
  transition: ${transition('border-top')};
  margin: ${spacing(0, 4)};
`;

const nullOrValue = <T extends unknown>(maybeNull: unknown, value: T): T | null => {
  return maybeNull === null ? null : value;
};

const LobbyView: React.FC = () => {
  const [open, setOpen] = useState<'join' | 'create' | null>(null);

  const joinOpen = nullOrValue(open, open === 'join');
  const createOpen = nullOrValue(open, open === 'create');

  return (
    <View flex={1} padding={2} header={<ViewHeader open={open} unsetOpen={() => setOpen(null)} />}>
      <Part open={joinOpen} onOpen={() => setOpen('join')} label="Rejoindre une partie">
        <JoinGame />
      </Part>

      <Fade show={open === null}>
        <Separator show={open === null} />
      </Fade>

      <Part open={createOpen} onOpen={() => setOpen('create')} label="Créer une partie">
        <CreateGame />
      </Part>
    </View>
  );
};

export default LobbyView;
