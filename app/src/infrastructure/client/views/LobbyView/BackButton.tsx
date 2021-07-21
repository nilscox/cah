import React from 'react';

import { Fade } from '../../components/Fade';
import { Icon } from '../../components/Icon';
import { IconButton } from '../../components/IconButton';
import { Rotate } from '../../components/Rotate';
import Back from '../../icons/back.svg';

type BackButtonProps = {
  show: boolean;
  onBack: () => void;
};

export const BackButton: React.FC<BackButtonProps> = ({ show, onBack }) => (
  <Fade show={show}>
    <Rotate show={show}>
      <IconButton onClick={onBack}>
        <Icon as={Back} />
      </IconButton>
    </Rotate>
  </Fade>
);
