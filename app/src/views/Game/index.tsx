import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';

import { GameDTO } from 'dtos/game.dto';
import { PlayerDTO } from 'dtos/player.dto';

import AnimatedViews from '../../components/AnimatedView';

import GameIdle from './GameIdle';
import PlayersAnswer from './PlayersAnswer';
import GameFinished from './GameFinished';
import QuestionMasterSelection from './QuestionMasterSelection';
import GameInfo from './GameInfo';
import { getExpectedAction } from './utils/expectedAction';

type GameHeaderProps = {
  gameId: string;
  toggleGameInfo: () => void;
  showWhatToDo: () => void;
};

const GameHeader: React.FC<GameHeaderProps> = ({ gameId, toggleGameInfo, showWhatToDo }) => (
  <div
    style={{ padding: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottom: '1px solid #789' }}
  >
    <div onClick={toggleGameInfo}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
      </svg>
    </div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      Game code: <span style={{ fontWeight: 'bold' }}>{gameId}</span>
    </div>
    <div onClick={showWhatToDo}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z"
        />
      </svg>
    </div>
  </div>
);

type GameProps = {
  game: GameDTO;
  player: PlayerDTO;
};

const Game: React.FC<GameProps> = ({ game, player }) => {
  const [endOfTurn, setEndOfTurn] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);

  useEffect(() => {
    if (game.playState === 'question_master_selection')
      setEndOfTurn(true);
  }, [game.playState]);

  const views = {
    gameIdle: <GameIdle game={game} />,
    gameFinished: <GameFinished game={game} />,
    playersAnswer: <PlayersAnswer game={game} player={player} />,
    questionMasterSelection: <QuestionMasterSelection game={game} player={player} nextTurn={() => setEndOfTurn(false)} />,
    gameInfo: <GameInfo game={game} />,
  };

  const getCurrentView = () => {
    if (showGameInfo) {
      return 'gameInfo';
    }

    if (game.state === 'idle') {
      return 'gameIdle';
    }

    if (endOfTurn) {
      return 'questionMasterSelection';
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
        gameId={game.id}
        toggleGameInfo={() => setShowGameInfo(show => !show)}
        showWhatToDo={() => toast(getExpectedAction(game, player, endOfTurn))}
      />
      <AnimatedViews style={{ flex: 1, overflow: 'auto' }} views={views} current={getCurrentView()} />
    </div>
  );
};

export default Game;
