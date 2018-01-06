import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import LogoutIcon from 'material-ui-icons/SettingsPower';
import LoadingButton from '../common/LoadingButton';
import {loginPlayer, logoutPlayer} from '../../actions';

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
    <div id="page-login" className="page">
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
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


export const LogoutButton = connect(
  state => ({ playerNick: state.player.nick, loading: state.player.isLogingOut }),
  dispatch => ({ onLogout: () => dispatch(logoutPlayer()) }),
)(({ playerNick, loading, onLogout }) => (
  <div className="logout-button">
    <div className="player-nick">{ playerNick }</div>
    <Tooltip title="Log out" placement="bottom">
      <LoadingButton loading={loading} fab aria-label="Log out" onClick={onLogout}>
        <LogoutIcon />
      </LoadingButton>
    </Tooltip>
  </div>
));
