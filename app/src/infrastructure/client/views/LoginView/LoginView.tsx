import React, { useState } from 'react';

import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';

import { login } from '../../../../domain/usecases/player/login/login';
import SubmittableInput from '../../components/elements/SubmittableInput';
import { Fade } from '../../components/layout/Fade';
import { useTimeout } from '../../hooks/useTimeout';
import { spacing } from '../../styles/theme';

import MainTitle from './MainTitle';

const Container = styled.div`
  padding: ${spacing(4)};
`;

const StyledMainTitle = styled(MainTitle)`
  margin: ${spacing(0, 0, 6)};
`;

type NickInputProps = {
  onSubmit: (nick: string) => void;
};

const NickInput: React.FC<NickInputProps> = ({ onSubmit }) => {
  const [nick, setNick] = useState('');
  const [show, setShow] = useState(false);

  useTimeout(() => setShow(true), 0);

  return (
    <Fade show={show} duration="slow">
      <SubmittableInput
        placeholder="Entrez votre pseudo..."
        value={nick}
        onTextChange={setNick}
        onSubmit={() => onSubmit(nick)}
      />
    </Fade>
  );
};

const LoginView: React.FC = () => {
  const dispatch = useDispatch();
  const [showNickInput, setShowNickInput] = useState(false);

  return (
    <Container>
      <StyledMainTitle onRest={() => setShowNickInput(true)} />
      {showNickInput && <NickInput onSubmit={(nick) => dispatch(login(nick))} />}
    </Container>
  );
};

export default LoginView;
