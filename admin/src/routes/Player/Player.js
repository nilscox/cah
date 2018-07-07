import * as React from 'react';
import { connect } from 'react-redux';

import { updatePlayer } from '../../redux/actions';

import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';


const mapStateToProps = (state) => {
  return {
    players: state.players,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleOnBlur: (player, nick) => dispatch(updatePlayer(player, nick)),
  }
}; 

class Player extends React.Component {
  state = {
    avatar: '',
    avatarEdition: false,
    nick: '',
    nickEdition: false,
    connecteds: false,
  };


  handleOnAvatarClick() {
    this.setState({ avatarEdition: true });
  };

  handleChangeAvatar(e) {
    this.setState({ avatar: e.target.value });
  };

  handleOnNickClick() {
    this.setState({ nickEdition: true });
  };

  handleChangeNick(e) {
    this.setState({ nick: e.target.value });
  };

  handleBlurNick(e) {
        const { nick } = this.state
    e.preventDefault();
    if(nick !== '') {
      this.props.handleOnBlur(nick);
    };
  }

  render() {
    if (this.props.players.length < 1) {
      return null;
    }    

    const player = this.props.players[0];

    let playerAvatar = player.avatar;

    if (this.state.avatarEdition) {
      playerAvatar = (
        <FormControl
            componentClass="input"
            value={this.state.avatar}
            onChange={(e) => this.handleChangeAvatar(e)}
        >
        </FormControl>
      )
    };

    let playerNick = player.nick;

    if (this.state.nickEdition) {
      playerNick = (
        <FormControl
            componentClass="input"
            value={this.state.nick}
            onChange={(e) => this.handleChangeNick(e)}
            onBlur={(e) => this.handleBlurNick(e)}
        >
        </FormControl>
      )
    };

    return(
      <form>

        <FormGroup onClick={() => this.handleOnAvatarClick()}>

          <ControlLabel>Player avatar: </ControlLabel>

          {playerAvatar}

        </FormGroup>

        <FormGroup onClick={() => this.handleOnNickClick()}>

          <ControlLabel>Player nick: </ControlLabel>

          {playerNick}

        </FormGroup>


        <FormGroup>

          <ControlLabel>Connected: </ControlLabel>

            {this.state.connected}

        </FormGroup>

      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);
