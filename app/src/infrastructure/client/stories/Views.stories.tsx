import React from 'react';

import {} from '@storybook/addon-controls';
import { Meta, Story } from '@storybook/react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import { Game, GameState, isStarted, PlayState, StartedGame } from '../../../domain/entities/Game';
import { FullPlayer } from '../../../domain/entities/Player';
import { configureStore } from '../../../store/configureStore';
import { createGame } from '../../../tests/factories';
import CAHApp from '../App';
import { gameRouterHistory } from '../views/GameView/GameView';

import { answers, mano, player, players, questions, startedGame } from './fixtures';
import { storiesRouterHistory, stubDependencies } from './stubs';

const questionOptions = ['no blanks', 'one blank', 'multiple blanks'] as const;

export default {
  title: 'Views',
  component: CAHApp,
  argTypes: {
    question: {
      options: questionOptions,
      control: { type: 'radio' },
      defaultValue: 'one blank',
    },
  },
} as Meta;

type TemplateProps = {
  player?: FullPlayer;
  game?: Game | StartedGame;
  question: typeof questionOptions[number];
};

const Template: Story<TemplateProps> = ({ player, game, question }) => {
  const deps = stubDependencies();
  const store = configureStore(deps);

  if (game && isStarted(game)) {
    game.question = questions[['no blanks', 'one blank', 'multiple blanks'].indexOf(question)];
  }

  deps.playerGateway.player = player;
  deps.gameGateway.game = game;

  // @ts-expect-error the reference gets lost somehow
  deps.routerGateway.history = storiesRouterHistory;
  // storiesRouterHistory.push(pathname);

  // @ts-expect-error the reference gets lost somehow
  deps.gameRouterGateway.history = gameRouterHistory;

  return (
    <Router history={storiesRouterHistory}>
      <ReduxProvider store={store}>
        <CAHApp />
      </ReduxProvider>
    </Router>
  );
};

export const Login = Template.bind({});
Login.args = {};

export const Lobby = Template.bind({});
Lobby.args = {
  player: mano,
};

export const GameIdle = Template.bind({});
GameIdle.args = {
  player,
  game: createGame({
    state: GameState.idle,
    players,
  }),
};

export const PlayersAnswer = Template.bind({});
PlayersAnswer.args = {
  player,
  game: {
    ...startedGame,
    playState: PlayState.playersAnswer,
  },
};

export const QuestionMasterSelection = Template.bind({});
QuestionMasterSelection.args = {
  player,
  game: {
    ...startedGame,
    playState: PlayState.questionMasterSelection,
    answers,
  },
};

export const EndOfTurn = Template.bind({});
EndOfTurn.args = {
  player,
  game: {
    ...startedGame,
    questionMaster: player,
    playState: PlayState.endOfTurn,
    answers,
  },
};

export const Finished = Template.bind({});
Finished.args = {
  player,
  game: createGame({
    state: GameState.finished,
    players,
  }),
};
