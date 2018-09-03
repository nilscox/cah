import * as React from 'react';
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class CreatePlayer extends React.Component {
  state = {
    nick: '',
  };

  handleChange(e) {
    this.setState({ nick: e.target.value });
  }

  onSubmitPlayer(e) {
    e.preventDefault();
    if(this.state.nick !== '') {
      this.props.onSubmit(this.state.nick);
    }
  }

  render() {
    return (
      <form className="add-player-form" onSubmit={(e) => this.onSubmitPlayer(e)}>
        <FormGroup controlId="formBasicText">

          <ControlLabel>Create player</ControlLabel>
          <FormControl
            type="text"
            value={this.state.value}
            placeholder="Enter text"
            onChange={(e) => this.handleChange(e)}
          />
          <FormControl.Feedback />
        </FormGroup>

        <Button bsClass="add-button btn" type="submit">
          Create player
        </Button>

      </form>
    );
  }

}

export default CreatePlayer;
