import * as React from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import './CreateGame.css';

const SelectPlayer = ({ player }) => (
  <option value={player.nick}>{player.nick}</option>
);

class CreateGame extends React.Component {
  state = {
    players: [],
    owner: '',
    lang: 'fr',
  };

  static getDerivedStateFromProps(props) {
    const players = props.players.filter(player => !player.inGame);

    if (players.length > 0)
      return { players, owner: players[0].nick };

    return null;
  }

  handleChangeOwner(e) {
    this.setState({ owner: e.target.value });
  };

  handleChangeLang(e) {
    this.setState({ lang: e.target.value });
  };

  onSubmitGame(e) {
    const { owner, lang } = this.state
    e.preventDefault();
    if(owner !== '') {
      this.props.onSubmit(owner, lang);
    };
  }

  render() {
    return (
      <form className="add-game-form" onSubmit={(e) => this.onSubmitGame(e)}>

        <FormGroup>

          <ControlLabel>Select owner</ControlLabel>

          <FormControl
            componentClass="select"
            value={this.state.owner}
            onChange={(e) => this.handleChangeOwner(e)}
          >

            { this.state.players.map((player) => (
              <SelectPlayer
                key={`player-${player.nick}`}
                player={player}
                selected={this.state.owner === player.nick}
              />
            )) }

          </FormControl>

        </FormGroup>

        <FormGroup>

          <ControlLabel>Select lang</ControlLabel>

          <FormControl
            componentClass="select"
            value={this.state.lang}
            onChange={(e) => this.handleChangeLang(e)}
          >

            <option value="en">English</option>
            <option value="fr">Français</option>

          </FormControl>

        </FormGroup>

        <Button bsClass="add-button btn" type="submit">
          Create Game
        </Button>

      </form>

    );
  };
} 

export default CreateGame;