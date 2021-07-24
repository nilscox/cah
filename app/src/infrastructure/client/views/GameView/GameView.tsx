import React, { useEffect } from 'react';

import { createBrowserHistory, createMemoryHistory } from 'history';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { redirectToGameView } from '../../../../domain/usecases/game/redirectToGameView/redirectToGameView';
import { View } from '../../components/domain/View';
import { Icon } from '../../components/elements/Icon';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import Menu from '../../icons/menu.svg';

import { GameIdleView } from './GameIdleView';
import { GameStartedView } from './GameStartedView/GameStartedView';

const memoryRouter = true;
export const gameRouterHistory = memoryRouter ? createMemoryHistory() : createBrowserHistory();

const GameView: React.FC = () => {
  const dispatch = useDispatch();

  const player = usePlayer();
  const game = useGame();

  useEffect(() => void dispatch(redirectToGameView()), [dispatch, game.state, game.playState]);

  return (
    <View player={player} icon={<Icon as={Menu} />}>
      <Router history={gameRouterHistory}>
        <Switch>
          <Route path="/game/:gameCode/idle" component={GameIdleView} />
          <Route path="/game/:gameCode/started" component={GameStartedView} />
          <Route>
            <Redirect to={`/game/${game.code}/idle`} />
          </Route>
        </Switch>
      </Router>
    </View>
  );
};

export default GameView;
