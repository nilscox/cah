import React, { useEffect } from 'react';

import useAxios from 'axios-hooks';
import { useTranslation } from 'react-i18next';
import { useTrail, animated, useSpring } from 'react-spring';

import useHandleError from '../hooks/useHandleError';
import { useDispatch } from '../hooks/useGame';

import InputForm from '../components/InputForm';
import LanguageSelector from '../components/LanguageSelector';

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [{ loading, data: player, error, response }, signup] = useAxios(
    {
      method: 'POST',
      url: '/api/auth/signup',
    },
    { manual: true },
  );

  useHandleError(error, {
    message: error => {
      if (error.response?.data === 'nick already taken') {
        return t('auth.nickAlreadyTaken') as string;
      }
    },
  });

  useEffect(() => {
    if (response?.status === 201) {
      dispatch({ type: 'setplayer', player });
    }
  }, [response?.status]);

  const trail = useTrail(3, {
    config: { tension: 100 },
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 500,
    onRest: () => setInputSpring({ to: { opacity: 1 } }),
  });

  const [inputSpring, setInputSpring] = useSpring(() => ({
    from: { opacity: 0 },
    to: {},
    config: { tension: 40 },
    delay: 200,
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
    </>,
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontSize: 26, width: '75%', margin: '40px auto', letterSpacing: 6, lineHeight: '1.4em' }}>
        {trail.map((props, index) => (
          <animated.div key={index} style={props}>
            {items[index]}
          </animated.div>
        ))}
      </div>

      <animated.div
        style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '75%', margin: '0 auto', ...inputSpring }}
      >
        <InputForm
          loading={loading}
          placeholder={t('auth.nickPlaceholder')}
          minLength={3}
          onSubmit={nick => signup({ data: { nick } })}
        />

        <LanguageSelector />
      </animated.div>
    </div>
  );
};

export default Auth;
