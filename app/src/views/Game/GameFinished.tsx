import React, { useMemo, useEffect } from 'react';

import { animated, useTrail } from 'react-spring';
import useAxios from 'axios-hooks';

import { GameDTO } from 'dtos/game.dto';

import useHandleError from '../../hooks/useHandleError';

type PlayerScore = {
  nick: string;
  score: number;
};

type ScoresListProps = {
  scores: PlayerScore[];
};

const ScoresList: React.FC<ScoresListProps> = ({ scores }) => {
  const trail = useTrail(scores.length, {
    config: { tension: 50, friction: 70, mass: 20 },
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <>
      {scores.map(({ nick, score }, n) => (
        <animated.div
          key={nick}
          style={{ display: 'flex', flexDirection: 'row', margin: '5px 0', ...trail[scores.length - n - 1] }}
        >
          <div style={{ flex: 1 }}>{n + 1}.</div>
          <div style={{ flex: 4 }}>{nick}</div>
          <div style={{ flex: 1 }}>({score})</div>
        </animated.div>
      ))}
    </>
  );
};

type GameFinishedProps = {
  game: GameDTO;
  onLeave: () => void;
};

const GameFinished: React.FC<GameFinishedProps> = ({ game, onLeave }) => {
  const [{ error, response }, leaveGame] = useAxios(
    {
      method: 'POST',
      url: '/api/auth/logout',
    },
    { manual: true }
  );

  useHandleError(error);

  useEffect(() => {
    if (response?.status === 204) {
      onLeave();
    }
  }, [response?.status]);

  const scores = useMemo(() => {
    return Object.entries(game.scores!)
      .map(([nick, score]) => ({ nick, score }))
      .sort(({ score: a }, { score: b }) => b - a)
      .reduce((arr, { nick, score }) => [...arr, { nick, score }], [] as PlayerScore[]);
  }, [game.scores]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 15 }}>
        <ScoresList scores={scores} />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => leaveGame()}
      >
        Leave game
      </div>
    </div>
  );
};

export default GameFinished;
