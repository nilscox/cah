import React from 'react';

import {} from '@storybook/addon-controls';
import { Meta, Story } from '@storybook/react';
import { Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-router-dom';

import { Game, GameState, isStarted, PlayState, StartedGame } from '../../../domain/entities/Game';
import { FullPlayer } from '../../../domain/entities/Player';
import { Turn } from '../../../domain/entities/Turn';
import { openMenu } from '../../../domain/usecases/app/navigate/navigate';
import { configureStore } from '../../../store/configureStore';
import { AppActionOrThunk } from '../../../store/types';
import { createGame } from '../../../tests/factories';
import CAHApp from '../App';
import { gameHistory } from '../views/GameView/GameView';

import { answers, player, players, questions, startedGame, turns } from './fixtures';
import { storiesHistory, stubDependencies } from './stubs';

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
  turns?: Turn[];
  action?: AppActionOrThunk;
};

const Template: Story<TemplateProps> = ({ player, game, question, turns, action }) => {
  const deps = stubDependencies();
  const store = configureStore(deps);

  if (action) {
    store.dispatch(action());
  }

  if (game && isStarted(game)) {
    const questionIndex = ['no blanks', 'one blank', 'multiple blanks'].indexOf(question);

    game.question = questions[questionIndex];
  }

  deps.playerGateway.player = player;
  deps.gameGateway.game = game;
  deps.gameGateway.turns = turns;

  // @ts-expect-error the reference gets lost somehow
  deps.routerGateway.history = storiesHistory;
  // @ts-expect-error same here, obviously
  deps.routerGateway.gameHistory = gameHistory;

  return (
    <Router history={storiesHistory}>
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
  player,
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
  turns,
};

export const GameMenu = Template.bind({});
GameMenu.args = {
  player,
  game: startedGame,
  turns,
  action: openMenu,
};
