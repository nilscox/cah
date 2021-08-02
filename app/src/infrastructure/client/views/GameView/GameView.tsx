import React, { useEffect } from 'react';

import { createBrowserHistory, createMemoryHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, Router, Switch } from 'react-router-dom';

import { closeMenu, openMenu } from '../../../../domain/actions';
import { redirect } from '../../../../domain/usecases/game/redirect/redirect';
import { selectMenuOpen, selectNotification } from '../../../../store/selectors/appStateSelectors';
import { selectGame } from '../../../../store/selectors/gameSelectors';
import Header from '../../components/domain/Header';
import { Icon } from '../../components/elements/Icon';
import { IconButton } from '../../components/elements/IconButton';
import { useGame } from '../../hooks/useGame';
import { usePlayer } from '../../hooks/usePlayer';
import Back from '../../icons/back.svg';
import Menu from '../../icons/menu.svg';
import { View } from '../View';

import { AnswersList } from './AnswersList';
import { GameFinishedView } from './GameFinishedView';
import { GameIdleView } from './GameIdleView';
import GameMenu from './GameMenu';
import { PlayersAnswer } from './PlayersAnswer';

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
  const dispatch = useDispatch();

  const player = usePlayer();
  const game = useGame();

  const menuOpen = useSelector(selectMenuOpen);
  const notification = useSelector(selectNotification);

  useEffect(() => void dispatch(redirect()), [dispatch, game.state, game.playState, menuOpen]);

  return (
    <View header={<Header notification={notification} icon={<MenuIcon />} title="CAH" player={player} />}>
      <GameRouter />
    </View>
  );
};

export default GameView;
