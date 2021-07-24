import React from 'react';

import { Icon } from '../../components/elements/Icon';
import { IconButton } from '../../components/elements/IconButton';
import { Fade } from '../../components/layout/Fade';
import { Rotate } from '../../components/layout/Rotate';
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
