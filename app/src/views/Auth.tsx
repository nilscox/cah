import React, { useEffect } from 'react';

import useAxios from 'axios-hooks';
import { useTrail, animated, useSpring } from 'react-spring';

import { PlayerDTO } from 'dtos/player.dto';

import InputForm from '../components/InputForm';
import useHandleError from '../hooks/useHandleError';

type AuthProps = {
  setPlayer: (user: PlayerDTO) => void;
};

const Auth: React.FC<AuthProps> = ({ setPlayer }) => {
  const [{ loading, data: player, error, response }, signup] = useAxios(
    {
      method: 'POST',
      url: '/api/auth/signup'
    },
    { manual: true }
  );

  useHandleError(error, {
    message: error => {
      if (error.response?.data === 'nick already taken') return 'This nick is already taken.';
    }
  });

  useEffect(() => {
    if (response?.status === 201) {
      setPlayer(player);
    }
  }, [response?.status]);

  const trail = useTrail(3, {
    config: { tension: 100 },
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
    onRest: () => setInputSpring({ to: { opacity: 1 } })
  });

  const [inputSpring, setInputSpring] = useSpring(() => ({
    from: { opacity: 0 },
    to: {},
    config: { tension: 40 },
    delay: 200
  }));

  const items = [
    <>
      <span style={{ fontWeight: 'bold' }}>C</span>ards
    </>,
    <>
      <span style={{ fontWeight: 'bold' }}>A</span>gaints
    </>,
    <>
      <span style={{ fontWeight: 'bold' }}>H</span>umanity
    </>
  ];

  return (
    <>
      <div style={{ fontSize: 26, width: '75%', margin: '40px auto', letterSpacing: 6, lineHeight: '1.4em' }}>
        {trail.map((props, index) => (
          <animated.div key={index} style={props}>
            {items[index]}
          </animated.div>
        ))}
      </div>

      <animated.div style={{ width: '75%', margin: 'auto', ...inputSpring }}>
        <InputForm
          loading={loading}
          placeholder="Enter your nick..."
          minLength={3}
          onSubmit={nick => signup({ data: { nick } })}
        />
      </animated.div>
    </>
  );
};

export default Auth;
