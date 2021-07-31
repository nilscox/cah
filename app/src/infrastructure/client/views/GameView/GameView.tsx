import React, { useEffect } from 'react';

import styled from '@emotion/styled';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { useDispatch } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { redirect } from '../../../../domain/usecases/game/redirect/redirect';
import Header from '../../components/domain/Header';
import { Icon } from '../../components/elements/Icon';
import { Flex } from '../../components/layout/Flex';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import Menu from '../../icons/menu.svg';

import { GameFinishedView } from './GameFinishedView';
import { GameIdleView } from './GameIdleView';
import { AnswersList } from './GameStartedView/AnswersList';
import { PlayersAnswer } from './GameStartedView/PlayersAnswer';

const Container = styled(Flex)`
  height: 100%;
`;

const Content = styled(Flex)`
  flex: 1;
  overflow: auto;
`;

const memoryRouter = true;
export const gameRouterHistory = memoryRouter ? createMemoryHistory() : createBrowserHistory();

const routePrefix = '/game/:code';

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
            <Route path={`${routePrefix}/idle`} component={GameIdleView} />
            <Route path={`${routePrefix}/finished`} component={GameFinishedView} />
            <Route path={`${routePrefix}/started/players-answer`} component={PlayersAnswer} />
            <Route path={`${routePrefix}/started/question-master-selection`} component={AnswersList} />
            <Route path={`${routePrefix}/started/end-of-turn`} component={AnswersList} />
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
