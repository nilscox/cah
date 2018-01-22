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

  const onFormSubmit = e => {
    e.preventDefault();
    onLogin(nick);
  };

  return (
    <div className="content">
      <h2>CAH</h2>
      <div className="login-form">
        <form onSubmit={onFormSubmit}>
          <TextField
            label="Choose your Nick"
            placeholder="Nick"
            fullWidth
            onChange={e => nick = e.target.value}
          />
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
