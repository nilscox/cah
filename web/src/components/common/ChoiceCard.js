// @flow

import * as React from 'react';

import type { ChoiceType } from '../../types/models';
import { toClassName } from '../../utils';

type ChoiceCardProps = {|
  choice: ChoiceType,
  className: string,
  onClick: (SyntheticEvent<>) => void,
|};

const ChoiceCard = ({
  choice,
  className,
  onClick,
}: ChoiceCardProps) => (
  <div
    className={toClassName([ 'card', 'choice', className ])}
    onClick={onClick}>
    <div className="text">{choice.text}</div>
  </div>
);

export default ChoiceCard;
