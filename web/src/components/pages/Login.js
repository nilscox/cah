import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import LogoutIcon from 'material-ui-icons/SettingsPower';
import LoadingButton from '../common/LoadingButton';
import {login, logout} from '../../services/player';

class Login extends Component {
  onLogin(nick) {
    login({ nick })
      .then(player => this.props.onPlayerLogin(player))
      .catch(err => console.error(err));
  }

  render() {
    let nick = null;

    const onFormSubmit = e => {
      e.preventDefault();
      this.onLogin(nick);
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
  }
}

export class LogoutButton extends Component {
  state = {
    loading: false,
  };

  onLogout() {
    if (this.state.loading)
      return;

    this.setState({ loading: true });

    logout()
      .then(() => this.setState({ loading: false }))
      .then(() => this.props.onLogout());
  }

  render() {
    return (
      <div className="logout-button">
        <div className="player-nick">{ this.props.player.nick }</div>
        <Tooltip title="Log out" placement="bottom">
          <LoadingButton loading={this.state.loading} fab aria-label="Log out" onClick={() => this.onLogout()}>
            <LogoutIcon />
          </LoadingButton>
        </Tooltip>
      </div>
    );
  }
}

export default Login;
