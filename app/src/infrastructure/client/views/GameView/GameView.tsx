import React, { useEffect } from 'react';

import styled from '@emotion/styled';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { closeMenu, openMenu } from '../../../../domain/actions';
import { redirect } from '../../../../domain/usecases/game/redirect/redirect';
import { selectMenuOpen } from '../../../../store/selectors/appStateSelectors';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import Header from '../../components/domain/Header';
import { Icon } from '../../components/elements/Icon';
import { IconButton } from '../../components/elements/IconButton';
import { Flex } from '../../components/layout/Flex';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import Back from '../../icons/back.svg';
import Menu from '../../icons/menu.svg';

import { AnswersList } from './AnswersList';
import { GameFinishedView } from './GameFinishedView';
import { GameIdleView } from './GameIdleView';
import GameMenu from './GameMenu';
import { PlayersAnswer } from './PlayersAnswer';

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

const MenuIcon = () => {
  const menuOpen = useSelector(selectMenuOpen);
  const dispatch = useDispatch();

  const handleToggleMenu = () => {
    if (menuOpen) {
      return dispatch(closeMenu());
    }

    dispatch(openMenu());
  };

  return (
    <IconButton onClick={handleToggleMenu}>
      <Icon as={menuOpen ? Back : Menu} />
    </IconButton>
  );
};

const GameRouter: React.FC = () => {
  const game = useSelector(selectGame);

  return (
    <Router history={gameRouterHistory}>
      <Switch>
        <Route path={`${routePrefix}/idle`} component={GameIdleView} />
        <Route path={`${routePrefix}/finished`} component={GameFinishedView} />
        <Route path={`${routePrefix}/started/players-answer`} component={PlayersAnswer} />
        <Route path={`${routePrefix}/started/question-master-selection`} component={AnswersList} />
        <Route path={`${routePrefix}/started/end-of-turn`} component={AnswersList} />
        <Route path={`${routePrefix}/menu`} component={GameMenu} />
        <Route>
          <Redirect to={`/game/${game.code}/idle`} />
        </Route>
      </Switch>
    </Router>
  );
};

const GameView: React.FC = () => {
  const menuOpen = useSelector(selectMenuOpen);
  const dispatch = useDispatch();

  const player = usePlayer();
  const game = useGame();

  useEffect(() => void dispatch(redirect()), [dispatch, game.state, game.playState, menuOpen]);

  return (
    <Container>
      <Header icon={<MenuIcon />} title="CAH" player={player} />
      <Content>
        <GameRouter />
      </Content>
    </Container>
  );
};

export default GameView;
