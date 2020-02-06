import React, { useState } from 'react';

import { animated, useSpring } from 'react-spring';

type InputFormProps = {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  loading?: boolean;
  defaultValue?: string;
  onSubmit: (value: string) => void;
};

const InputForm: React.FC<InputFormProps> = ({
  placeholder,
  minLength = 1,
  maxLength = Infinity,
  loading,
  defaultValue,
  onSubmit,
}) => {
  const [value, setValue] = useState(defaultValue || '');
  const canSubmit = !loading && value.length >= minLength && value.length <= maxLength;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (canSubmit) {
      onSubmit(value);
    }
  };

  const submitSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: canSubmit ? 1 : 0 },
  });

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row' }}>
      <input
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={e => setValue(e.target.value)}
        style={{ flex: 1 }}
      />
      <animated.button
        type="submit"
        style={{
          border: 'none',
          padding: 0,
          fontWeight: 'bold',
          marginLeft: 16,
          ...submitSpring,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="green" d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z" />
        </svg>
      </animated.button>
    </form>
  );
};

export default InputForm;
