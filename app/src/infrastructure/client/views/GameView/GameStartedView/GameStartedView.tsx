import React from 'react';

import { Route, Switch } from 'react-router-dom';

import { GameState } from '../../../../../domain/entities/Game';
import { useGame } from '../../../hooks/useGame';

import { PlayersAnswer } from './PlayersAnswer';
import { QuestionMasterSelection } from './QuestionMasterSelection';

const routePrefix = '/game/:code/started';

export const GameStartedView: React.FC = () => {
  const game = useGame();

  if (game.state !== GameState.started) {
    return null;
  }

  return (
    <Switch>
      <Route path={`${routePrefix}/players-answer`} component={PlayersAnswer} />
      <Route path={`${routePrefix}/question-master-selection`} component={QuestionMasterSelection} />
    </Switch>
  );
};
