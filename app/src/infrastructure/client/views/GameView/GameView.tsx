import React, { useEffect } from 'react';

import { createBrowserHistory, createMemoryHistory } from 'history';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { redirect } from '../../../../domain/usecases/game/redirect/redirect';
import Header from '../../components/domain/Header';
import { Icon } from '../../components/elements/Icon';
import { Flex } from '../../components/layout/Flex';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import Menu from '../../icons/menu.svg';

import { GameIdleView } from './GameIdleView';
import { GameStartedView } from './GameStartedView/GameStartedView';

const Container = styled(Flex)`
  height: 100%;
`;

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;
`;

const memoryRouter = true;
export const gameRouterHistory = memoryRouter ? createMemoryHistory() : createBrowserHistory();

const GameView: React.FC = () => {
  const dispatch = useDispatch();

  const player = usePlayer();
  const game = useGame();

  useEffect(() => void dispatch(redirect()), [dispatch, game.state, game.playState]);

  return (
    <Container>
      <Header icon={<Icon as={Menu} />} title="CAH" player={player} />
      <Content>
        <Router history={gameRouterHistory}>
          <Switch>
            <Route path="/game/:gameCode/idle" component={GameIdleView} />
            <Route path="/game/:gameCode/started" component={GameStartedView} />
            <Route>
              <Redirect to={`/game/${game.code}/idle`} />
            </Route>
          </Switch>
        </Router>
      </Content>
    </Container>
  );
};

export default GameView;
