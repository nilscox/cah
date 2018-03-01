// @flow

import * as React from 'react';

import type { ChoiceType } from 'Types/models';
import { toClassName } from '../../utils';

type ChoiceCardProps = {|
  className?: string,
  choice: ChoiceType,
  onClick: SyntheticEvent<> => void,
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
