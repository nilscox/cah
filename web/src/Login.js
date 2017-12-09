import React from 'react';

const Login = (props) => {
  let nick = null;
  let content = null;

  let onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(nick);
  };

  if (props.nick) {
    content = (
      <span>
        <span style={{fontWeight: 'bold'}}>
          {props.nick}
        </span>
        <span style={{fontSize: 'small', paddingLeft: '15px', cursor: 'pointer'}} onClick={props.onLogout}>
          (logout)
        </span>
      </span>
    );
  }
  else {
    content = (
      <form style={{display: 'inline-block'}} onSubmit={onSubmit}>
        <input onChange={(e) => nick = e.target.value} />
      </form>
    );
  }

  return (
    <div>
      <span>Nick: </span>
      {content}
    </div>
  );
};

export default Login;
