import React from 'react';

import { Meta } from '@storybook/react';
import { StoryFnReactReturnType } from '@storybook/react/dist/ts3.9/client/preview/types';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import { setGame, setPlayer } from '../../../domain/actions';
import { Game, GameState, PlayState, StartedGame } from '../../../domain/entities/Game';
import { configureStore } from '../../../store/configureStore';
import { createAnswer, createGame, createPlayer, createQuestion } from '../../../tests/factories';
import GameView, { gameRouterHistory } from '../views/GameView/GameView';
import LobbyView from '../views/LobbyView/LobbyView';
import LoginView from '../views/LoginView/LoginView';

import { dependencies, storiesRouterHistory } from './stubs';

const store = configureStore(dependencies);

store.dispatch(setPlayer(createPlayer()));
store.dispatch(setGame(createGame()));

const reduxProviderDecorator = (Story: () => StoryFnReactReturnType) => (
  <ReduxProvider store={store}>
    <Story />
  </ReduxProvider>
);

const storiesRouterProvider = (Story: any) => (
  <Router history={storiesRouterHistory}>
    <Story />
  </Router>
);

export default {
  title: 'Views',
  decorators: [reduxProviderDecorator, storiesRouterProvider],
} as Meta;

export const Login = () => <LoginView />;
export const Lobby = () => <LobbyView />;

const createGameStory = (pathname: string, game: Game | StartedGame) => {
  const store = configureStore(dependencies);

  store.dispatch(setPlayer(createPlayer()));
  store.dispatch(setGame(game));

  gameRouterHistory.push('/game/code' + pathname);

  return (
    <ReduxProvider store={store}>
      <GameView />
    </ReduxProvider>
  );
};

const players = ['nils', 'tom', 'jeanne', ' vio'].map((nick) => createPlayer({ nick }));

const questionMaster = players[0];

const question = createQuestion({ text: "J'ai envie de .", blanks: [14] });

const answers = [
  createAnswer({ choices: ['avoir de la merde dans les yeux'], player: players[1] }),
  createAnswer({ choices: ['toi'], player: players[2] }),
  createAnswer({ choices: ['péter et rôter en même temps'], player: players[3] }),
];

const gameIdle = createGame({
  state: GameState.idle,
  players,
});

const gamePlayersAnswer = createGame({
  state: GameState.started,
  playState: PlayState.playersAnswer,
  players,
  questionMaster,
  question,
});

const gameQuestionMasterSelection = createGame({
  state: GameState.started,
  playState: PlayState.questionMasterSelection,
  players,
  questionMaster,
  question,
  answers,
});

const gameEndOfTurn = createGame({
  state: GameState.started,
  playState: PlayState.endOfTurn,
  players,
  questionMaster,
  question,
  answers,
});

const gameFinished = createGame({
  state: GameState.finished,
  players,
});

export const GameIdle = () => createGameStory('/idle', gameIdle);
export const PlayersAnswer = () => createGameStory('/started', gamePlayersAnswer);
export const QuestionMasterSelection = () => createGameStory('/started', gameQuestionMasterSelection);
export const EndOfTurn = () => createGameStory('/started', gameEndOfTurn);
export const GameFinished = () => createGameStory('/started', gameFinished);
