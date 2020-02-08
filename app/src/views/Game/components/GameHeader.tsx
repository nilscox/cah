import React, { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { animated, useSpring } from 'react-spring';

import { GameDTO } from 'dtos/game.dto';

import { usePrevious } from '../../../hooks/usePrevious';

const useGameState = (state: GameDTO['state'], playState: GameDTO['playState']) => {
  const { t } = useTranslation();

  const stateMap = {
    idle: t('game.state.idle'),
    started: undefined,
    finished: t('game.state.finished'),
  };

  const playStateMap = {
    players_answer: t('game.playState.playersAnswer'),
    question_master_selection: t('game.playState.questionMasterSelection'),
    end_of_turn: t('game.playState.endOfTurn'),
  };

  return stateMap[state] || playStateMap[playState!];
};

type GameStateProps = {
  state: GameDTO['state'];
  playState: GameDTO['playState'];
};

const GameState: React.FC<GameStateProps> = ({ state, playState }) => {
  const current = useGameState(state, playState);
  const prev = usePrevious(current);

  const [prevSpring, setPrevSpring] = useSpring(() => ({
    config: { tension: 100 },
    from: { top: -15 },
    to: { top: 20 },
  }));

  const [currentSpring, setCurrentSpring] = useSpring(() => ({
    from: { top: -40 },
    to: { top: 0 },
  }));

  useEffect(() => {
    setPrevSpring({ reset: true });
    setCurrentSpring({ reset: true });
  }, [current]);

  return (
    <>
      <animated.div style={{ ...currentSpring, position: 'relative' }}>
        { current }
      </animated.div>
      <animated.div style={{ ...prevSpring, position: 'relative', height: 0 }}>
        { prev }
      </animated.div>
    </>
  );
};

type GameHeaderProps = {
  state: GameDTO['state'];
  playState: GameDTO['playState'];
  toggleGameInfo: () => void;
  showWhatToDo: () => void;
};

const GameHeader: React.FC<GameHeaderProps> = ({ state, playState, toggleGameInfo, showWhatToDo }) => (
  <div
    style={{ padding: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', borderBottom: '1px solid #789', overflow: 'hidden' }}
  >
    <div onClick={toggleGameInfo}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z" />
      </svg>
    </div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      <GameState state={state} playState={playState} />
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

export default GameHeader;
