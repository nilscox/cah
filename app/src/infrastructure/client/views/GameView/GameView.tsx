import React from 'react';

import { createMemoryHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Router, Switch, useRouteMatch } from 'react-router-dom';

import { closeMenu, openMenu } from '../../../../domain/usecases/app/navigate/navigate';
import { selectNotification } from '../../../../store/selectors/appStateSelectors';
import Header from '../../components/domain/Header';
import { Icon } from '../../components/elements/Icon';
import { IconButton } from '../../components/elements/IconButton';
import { usePlayer } from '../../hooks/usePlayer';
import Back from '../../icons/back.svg';
import Menu from '../../icons/menu.svg';
import { View } from '../View';

import { AnswerQuestion } from './AnswerQuestion';
import { AnswersList } from './AnswersList';
import { GameFinishedView } from './GameFinishedView';
import { GameIdleView } from './GameIdleView';
import GameMenu from './GameMenu';

export const gameHistory = createMemoryHistory();

const routePrefix = '/game/:code';

const gameRoutes = {
  idle: `${routePrefix}/idle`,
  finished: `${routePrefix}/finished`,
  menu: `${routePrefix}/menu`,
  started: {
    answerQuestion: `${routePrefix}/started/answer-question`,
    winnerSelection: `${routePrefix}/started/winner-selection`,
    endOfTurn: `${routePrefix}/started/end-of-turn`,
  },
};

const MenuIcon = () => {
  const menuOpen = useRouteMatch(gameRoutes.menu);
  const dispatch = useDispatch();

  const handleToggleMenu = () => {
    dispatch(menuOpen ? closeMenu() : openMenu());
  };

  return (
    <IconButton onClick={handleToggleMenu}>
      <Icon as={menuOpen ? Back : Menu} />
    </IconButton>
  );
};

const GameRouter: React.FC = () => (
  <Router history={gameHistory}>
    <Switch>
      <Route path={gameRoutes.idle} component={GameIdleView} />
      <Route path={gameRoutes.finished} component={GameFinishedView} />
      <Route path={gameRoutes.menu} component={GameMenu} />
      <Route path={gameRoutes.started.answerQuestion} component={AnswerQuestion} />
      <Route path={gameRoutes.started.winnerSelection} component={AnswersList} />
      <Route path={gameRoutes.started.endOfTurn} component={AnswersList} />
      <Route>Not found.</Route>
    </Switch>
  </Router>
);

const GameView: React.FC = () => {
  const player = usePlayer();
  const notification = useSelector(selectNotification);

  const header = <Header notification={notification} icon={<MenuIcon />} title="CAH" player={player} />;

  return (
    <View header={header}>
      <GameRouter />
    </View>
  );
};

export default GameView;
