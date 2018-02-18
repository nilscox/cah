import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { loginPlayer } from '../../actions/player';

const mapStateToProps = state => ({
  player: state.player,
});

const mapDispatchToProps = dispatch => ({
  onLogin: nick => dispatch(loginPlayer(nick)),
});

const Login = ({ onLogin }) => {
  let nick = null;

  const onKeyPress = evt => {
    if (evt.key === 'Enter')
      onLogin(nick);
  };

  return (
    <div className="page" id="page-login">

      <div className="container">

        <h2 className="title">CAH</h2>

        <div className="login-form">
          <TextField
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

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
