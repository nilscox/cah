import * as React from 'react';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  HelpBlock,
  Grid,
  Row,
  Col
} from 'react-bootstrap';

import './CreateGame.css';

const SelectPlayer = ({ player }) => (
  <option value={player}>{player.nick}</option>
);

const FormField = ({ id, label, help, ...props }) => (
  <FormGroup controlId={id}>
    <ControlLabel>{ label }</ControlLabel>
    <FormControl {...props} />
    { help && <HelpBlock>{help}</HelpBlock> }
  </FormGroup>
);

class CreateGame extends React.Component {
  state = {
    players: [],
    owner: '',
    lang: 'fr',
    nbQuestions: 6,
    cardsPerPlayer: 4,
  };

  static getDerivedStateFromProps(props) {
    const players = props.players.filter(player => !player.inGame);

    if (players.length > 0)
      return { players, owner: players[0] };

    return null;
  }

  handleChangeOwner(e) {
    this.setState({ owner: e.target.value });
  };

  handleChangeLang(e) {
    this.setState({ lang: e.target.value });
  };

  handleChangeNbQuestions(e) {
    this.setState({ nbQuestions: e.target.value });
  };

  handleChangeCardsPerPlayer(e) {
    this.setState({ cardsPerPlayer: e.target.value });
  };

  onSubmitGame(e) {
    e.preventDefault();

    const { owner, lang, nbQuestions, cardsPerPlayer } = this.state

    this.props.onSubmit(owner, lang, nbQuestions, cardsPerPlayer);
  }

  render() {
    return (
      <form className="add-game-form" onSubmit={(e) => this.onSubmitGame(e)}>

        <Grid>

          <Row><Col>{ this.renderSelectOwner() }</Col></Row>
          <Row><Col>{ this.renderSelectLang() }</Col></Row>
          <Row>
            <Col xs={6}>{ this.renderSelectNbQuestions() }</Col>
            <Col xs={6}>{ this.renderSelectCardsPerPlayer() }</Col>
          </Row>

        </Grid>

        <Button bsClass="add-button btn" type="submit">
          Create Game
        </Button>

      </form>

    );
  }


  renderSelectOwner() {
    return (
      <FormField
        id="owner"
        label="owner"
        componentClass="select"
        value={this.state.nick}
        onChange={(e) => this.handleChangeOwner(e)}
      >
        { this.state.players.map((player) => (
          <SelectPlayer
            key={`player-${player.nick}`}
            player={player}
            selected={this.state.owner.nick === player.nick}
          />
        )) }
      </FormField>
    );
  }

  renderSelectLang() {
    return (
      <FormField
        id="lang"
        label="lang"
        componentClass="select"
        value={this.state.lang}
        onChange={(e) => this.handleChangeLang(e)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </FormField>
    );
  }

  renderSelectNbQuestions() {
    return (
      <FormField
        id="nbQuestions"
        componentClass="input"
        type="number"
        label="number of questions"
        value={this.state.nbQuestions}
        onChange={(e) => this.handleChangeNbQuestions(e)}
      />
    );
  }

  renderSelectCardsPerPlayer() {
    return (
      <FormField
        id="cardsPerPlayer"
        componentClass="input"
        type="number"
        label="cards per player"
        value={this.state.cardsPerPlayer}
        onChange={(e) => this.handleChangeCardsPerPlayer(e)}
      />
    );
  }
}

export default CreateGame;