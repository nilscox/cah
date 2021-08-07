import React from 'react';

import { act, cleanup, render, screen } from '@testing-library/react';
import expect from 'expect';
import { createMemoryHistory } from 'history';
import { Route, Router, useLocation } from 'react-router-dom';

import { createGame } from '../../tests/factories';

import { ReactRouterGateway } from './ReactRouterGateway';

describe('ReactRouterGateway', () => {
  afterEach(cleanup);

  it('redirects to another route', () => {
    const history = createMemoryHistory();
    const router = new ReactRouterGateway(history, createMemoryHistory());

    render(
      <Router history={history}>
        <Route path="/ici">labas</Route>
      </Router>,
    );

    act(() => {
      router.push('/ici');
    });

    expect(screen.getByText('labas')).not.toBeNull();

    expect(history.location.pathname).toEqual('/ici');
  });

  it('redirects to another game route', () => {
    const history = createMemoryHistory();
    const gameHistory = createMemoryHistory();

    const router = new ReactRouterGateway(history, gameHistory);

    render(
      <Router history={history}>
        <Route path="/game/:code">
          <Router history={gameHistory}>
            <Route path="/game/:code/boom">boom</Route>
          </Router>
        </Route>
      </Router>,
    );

    act(() => {
      router.pushGame(createGame({ code: 'edoc' }), '/boom');
    });

    expect(screen.getByText('boom')).not.toBeNull();

    expect(history.location.pathname).toEqual('/game/edoc');
    expect(gameHistory.location.pathname).toEqual('/game/edoc/boom');
  });

  it('redirects to another game route with a state', () => {
    const history = createMemoryHistory();
    const gameHistory = createMemoryHistory();

    const router = new ReactRouterGateway(history, gameHistory);

    const Content = () => <>{useLocation<{ pastis: number }>().state.pastis}</>;

    render(
      <Router history={history}>
        <Route path="/game/:code">
          <Router history={gameHistory}>
            <Route path="/game/:code/boom" component={Content} />
          </Router>
        </Route>
      </Router>,
    );

    act(() => {
      router.pushGame(createGame(), '/boom', { pastis: 51 });
    });

    expect(screen.getByText('51')).not.toBeNull();
  });
});
