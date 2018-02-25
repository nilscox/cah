// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';

import type { Dispatch, Action } from '../../types/actions';
import type { State } from '../../types/state';
import { loginPlayer } from '../../actions/player';

type LoginDispatchProps = {|
  onLogin: string => Action,
|}

type LoginProps = LoginDispatchProps;

const mapDispatchToProps: Dispatch => LoginDispatchProps = dispatch => ({
  onLogin: nick => dispatch(loginPlayer(nick)),
});

const Login = ({ onLogin }: LoginProps) => {
  let nick = null;
  let invalid = false;

  const onKeyPress = evt => {
    if (evt.key === 'Enter') {
      if (nick)
        onLogin(nick);
      else
        invalid = true;
    }
  };

  return (
    <div className="page" id="page-login">
      <div className="container">

        <h2 className="title">CAH</h2>

        <div className="login-form">
          <TextField
            className={invalid && 'invalid'}
            label="Choose your Nick"
            placeholder="Nick"
            fullWidth
            onChange={e => nick = e.target.value}
            onKeyPress={onKeyPress}
          />
        </div>

      </div>
    </div>
  );
};

export default connect(null, mapDispatchToProps)(Login);
