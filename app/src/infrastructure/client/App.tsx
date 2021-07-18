import React from 'react';

import { setNick } from '../../domain/playerSlice';
import { useDispatch, useSelector } from '../../store';

const App: React.FC = () => {
  const nick = useSelector((state) => state.player.nick);
  const dispatch = useDispatch();

  return <button onClick={() => dispatch(setNick('Toto'))}>{nick}</button>;
};

export default App;
