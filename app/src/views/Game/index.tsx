import React, { useState, useEffect } from 'react';

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
import { getExpectedAction } from './utils/expectedAction';

type GameProps = {
  game: GameDTO;
  player: PlayerDTO;
  onLeave: () => void;
};

const Game: React.FC<GameProps> = ({ game, player, onLeave }) => {
  const [showGameInfo, setShowGameInfo] = useState(false);

  const views = {
    gameIdle: <GameIdle game={game} />,
    gameFinished: <GameFinished game={game} onLeave={onLeave} />,
    playersAnswer: <PlayersAnswer game={game} player={player} />,
    questionMasterSelection: <QuestionMasterSelection game={game} player={player} />,
    gameInfo: <GameInfo game={game} />,
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
        showWhatToDo={() => toast(getExpectedAction(game, player))}
      />
      <AnimatedViews style={{ flex: 1, overflow: 'auto' }} views={views} current={getCurrentView()} />
    </div>
  );
};

export default Game;
