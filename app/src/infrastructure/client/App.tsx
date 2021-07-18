import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { connect } from '../../domain/player/connect/connect';
import { fetchMe } from '../../domain/player/fetchMe/fetchMe';
import { login } from '../../domain/player/login/login';
import { AppState } from '../../store/types';

const App: React.FC = () => {
  const player = useSelector((state: AppState) => state.player);
  const dispatch = useDispatch();

  useEffect(() => void dispatch(fetchMe()), [dispatch]);

  useEffect(() => {
    if (player) {
      dispatch(connect());
    }
  }, [player?.nick, dispatch]);

  return <button onClick={() => dispatch(login('Toto'))}>{player?.nick || 'log in'}</button>;
};

export default App;
