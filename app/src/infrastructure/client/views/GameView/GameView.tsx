import React from 'react';

import { createBrowserHistory, createMemoryHistory } from 'history';
import { Redirect, Route, RouteComponentProps, Router, Switch } from 'react-router-dom';

import { Icon } from '../../components/Icon';
import { View } from '../../components/View';
import { usePlayer } from '../../hooks/player';
import { useGame } from '../../hooks/useGame';
import Menu from '../../icons/menu.svg';

import { GameIdle } from './GameIdle';
import { GameStarted } from './GameStarted';

export const gameRouterHistory = createMemoryHistory();
// export const gameRouterHistory = createBrowserHistory();

type RouteParams = {
  gameCode: string;
};

const GameView: React.FC<RouteComponentProps<RouteParams>> = ({ match: { params } }) => {
  const player = usePlayer();
  const game = useGame();

  if (params.gameCode !== game.code) {
    return <Redirect to={`/game/${game.code}`} />;
  }

  return (
    <View player={player} icon={<Icon as={Menu} />}>
      <Router history={gameRouterHistory}>
        <Switch>
          <Route path="/game/:gameCode/idle" component={GameIdle} />
          <Route path="/game/:gameCode/started" component={GameStarted} />
          <Route>
            <Redirect to={`/game/${game.code}/idle`} />
          </Route>
        </Switch>
      </Router>
    </View>
  );
};

export default GameView;
