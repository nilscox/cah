import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

import GameHeader from './components/GameHeader';
import AnimatedViews from '../../components/AnimatedView';

import GameIdle from './GameIdle';
import PlayersAnswer from './PlayersAnswer';
import GameFinished from './GameFinished';
import QuestionMasterSelection from './QuestionMasterSelection';
import GameInfo from './GameInfo';

export const useExpectedAction = (game: GameDTO, player: PlayerDTO) => {
  const { t } = useTranslation();

  if (game.state === 'idle') {
    return t('game.actions.waitPlayersJoin');
  }

  if (game.state === 'finished') {
    return t('game.actions.gameFinished');
  }

  if (game.playState === 'players_answer') {
    if (game.questionMaster === player.nick) {
      return t('game.actions.waitPlayersAnswer');
    } else if (game.answered?.includes(player.nick)) {
      return t('game.actions.waitOtherPlayersAnswer');
    } else {
      return t('game.actions.submitAnswer');
    }
  }

  if (game.playState === 'end_of_turn') {
    if (game.questionMaster === player.nick) {
      return t('game.actions.turnFinishedQuestionMaster');
    } else {
      return t('game.actions.turnFinishedNotQuestionMaster');
    }
  }

  if (game.questionMaster === player.nick) {
    return t('game.actions.chooseAnswer');
  } else {
    return t('game.actions.waitQuestionMasterChooseAnswer');
  }
};

type GameProps = {
  game: GameDTO;
  player: PlayerDTO;
  onLeave: () => void;
};

const Game: React.FC<GameProps> = ({ game, player, onLeave }) => {
  const [showGameInfo, setShowGameInfo] = useState(false);
  const expectedAction = useExpectedAction(game, player);

  const views = {
    gameIdle: <GameIdle player={player} game={game} />,
    gameFinished: <GameFinished game={game} onLeave={onLeave} />,
    playersAnswer: <PlayersAnswer game={game} player={player} />,
    questionMasterSelection: <QuestionMasterSelection game={game} player={player} />,
    gameInfo: <GameInfo player={player} game={game} />,
  };

  const getCurrentView = () => {
    if (showGameInfo) {
      return 'gameInfo';
    }

    if (game.state === 'idle') {
      return 'gameIdle';
    }

    if (game.state === 'finished') {
      return 'gameFinished';
    }

    if (game.playState === 'players_answer') {
      return 'playersAnswer';
    }

    return 'questionMasterSelection';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <GameHeader
        state={game.state}
        playState={game.playState}
        toggleGameInfo={() => setShowGameInfo(show => !show)}
        showWhatToDo={() => toast(expectedAction, { className: 'toast-exected-action' })}
      />
      <AnimatedViews style={{ flex: 1, overflow: 'auto' }} views={views} current={getCurrentView()} />
    </div>
  );
};

export default Game;
