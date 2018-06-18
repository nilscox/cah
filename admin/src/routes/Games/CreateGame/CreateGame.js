import * as React from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import './CreateGame.css';

const SelectPlayer = ({ player }) => (
  <option value={player.nick}>{player.nick}</option>
);

class CreateGame extends React.Component {
state = {
  owner: ' ',
  lang: ' ',
};

render() {
  return (
    <form className="add-game-form">

      <FormGroup>

        <ControlLabel>Select owner</ControlLabel>

        <FormControl componentClass="select">
          {this.props.players.map((player) => <SelectPlayer key={`player-${player.nick}`} player={player} />)}
        </FormControl>

      </FormGroup>

      <FormGroup>

        <ControlLabel>Select lang</ControlLabel>

        <FormControl componentClass="select">

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